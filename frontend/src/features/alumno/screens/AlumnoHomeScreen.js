import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { useEventos } from '../../../context/EventosContext';
import ScreenHeader from '../../../components/ScreenHeader';
import EventoRow from '../../../components/EventoRow';
import { hoyKey } from '../../../utils/fechas';

const MES_ACTUAL = new Date().getMonth() + 1;
const NOMBRE_MES = new Date().toLocaleDateString('es-CL', { month: 'long' });

export default function AlumnoHomeScreen() {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { alumnos } = useAlumnos();
  const { getProximos } = useEventos();
  const navigation = useNavigation();

  const alumno = alumnos.find((a) => a.id === user.alumnoId);
  if (!alumno) return null;

  const fs = (s) => s * fontSize;
  const hoy = hoyKey();

  // Pago del mes: "pagado" o "no aplica" no generan alerta
  const pagoMesActual = alumno.pagos[MES_ACTUAL];
  const tienePagoPendiente = pagoMesActual !== true && pagoMesActual !== 'na';
  const mesesPagados = Object.values(alumno.pagos).filter((v) => v === true).length;

  // Solo eventos de su categoría (o de todas)
  const proximos = getProximos(hoy, alumno.categoria, 6);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={`Hola, ${alumno.nombre_completo.split(' ')[0]} 👋`}
        subtitle={`${alumno.categoria} · FC Rodelindo Román`}
      />

      <View style={styles.inner}>
        {tienePagoPendiente && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => navigation.navigate('PerfilTab')}
            activeOpacity={0.8}
          >
            <Text style={[styles.alertTitle, { fontSize: fs(15) }]}>⚠️ Pago pendiente</Text>
            <Text style={[styles.alertText, { fontSize: fs(13) }]}>
              La mensualidad de {NOMBRE_MES} aún no ha sido registrada.
            </Text>
            <View style={styles.alertBtn}>
              <Text style={[styles.alertBtnText, { fontSize: fs(13) }]}>Ver pagos →</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: theme.surface1 }]}>
            <Text style={{ color: theme.textSec, fontSize: fs(12) }}>Asistencia</Text>
            <Text style={[styles.kpiValue, { color: theme.accent, fontSize: fs(26) }]}>{alumno.asistencia}%</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: theme.surface1 }]}>
            <Text style={{ color: theme.textSec, fontSize: fs(12) }}>Meses pagados</Text>
            <Text style={[styles.kpiValue, { color: theme.accent, fontSize: fs(26) }]}>{mesesPagados}</Text>
          </View>
        </View>

        {/* Próximas clases y eventos */}
        <View style={styles.seccionHeader}>
          <Text style={[styles.seccion, { color: theme.textPrim, fontSize: fs(16) }]}>Próximas clases y eventos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Calendario')}>
            <Text style={{ color: theme.accent, fontSize: fs(13) }}>Calendario ›</Text>
          </TouchableOpacity>
        </View>

        {proximos.length === 0 ? (
          <Text style={{ color: theme.textMuted, fontSize: fs(13) }}>No hay eventos planificados.</Text>
        ) : (
          proximos.map((ev) => (
            <EventoRow
              key={ev.id}
              ev={ev}
              badge="fecha"
              destacado={ev.fecha === hoy}
              onPress={() => navigation.navigate('Calendario', { vista: 'dia', fecha: ev.fecha })}
            />
          ))
        )}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.surface1, borderColor: theme.border, borderWidth: 1 }]}
          onPress={() => navigation.navigate('Calendario')}
        >
          <Text style={[styles.btnText, { color: theme.textPrim, fontSize: fs(14) }]}>📅 Abrir calendario completo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.accentDark }]}
          onPress={() => navigation.navigate('RankingTab')}
        >
          <Text style={[styles.btnText, { color: '#fff', fontSize: fs(14) }]}>
            🏆 Ver ranking de asistencia {alumno.categoria}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  inner: { padding: 24 },
  alertCard: {
    backgroundColor: 'rgba(245,166,35,0.1)', borderColor: '#F5A623', borderWidth: 1,
    borderRadius: 12, padding: 16, marginBottom: 20, gap: 6,
  },
  alertTitle: { color: '#F5A623', fontWeight: 'bold' },
  alertText: { color: '#F5A623' },
  alertBtn: { alignSelf: 'flex-start', backgroundColor: '#F5A623', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginTop: 4 },
  alertBtnText: { color: '#0B0F14', fontWeight: 'bold' },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  kpiCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 6 },
  kpiValue: { fontWeight: 'bold' },
  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seccion: { fontWeight: 'bold' },
  btn: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12 },
  btnText: { fontWeight: 'bold' },
});
