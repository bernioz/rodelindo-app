import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import ScreenHeader from '../../../components/ScreenHeader';

const MES_ACTUAL = new Date().getMonth() + 1;
const NOMBRE_MES = new Date().toLocaleDateString('es-CL', { month: 'long' });

const PROXIMAS_CLASES = [
  { id: 1, dia: 'Lunes',    fecha: '18 ago', hora: '16:00', lugar: 'Cancha Principal' },
  { id: 2, dia: 'Miércoles',fecha: '20 ago', hora: '16:00', lugar: 'Cancha Principal' },
  { id: 3, dia: 'Viernes',  fecha: '22 ago', hora: '17:00', lugar: 'Cancha Auxiliar'  },
];

export default function AlumnoHomeScreen() {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { alumnos } = useAlumnos();
  const navigation = useNavigation();

  const alumno = alumnos.find((a) => a.id === user.alumnoId);
  if (!alumno) return null;

  const pagoMesActual = alumno.pagos[MES_ACTUAL];
  const tienePagoPendiente = pagoMesActual !== true;

  const fs = (s) => s * fontSize;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}>

      <ScreenHeader title={`Hola, ${alumno.nombre_completo.split(' ')[0]} 👋`}
        subtitle={`${alumno.categoria} · FC Rodelindo Román`} />

      <View style={styles.inner}>

        {/* Alerta de pago si corresponde */}
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

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.kpiLabel, { color: theme.textSec, fontSize: fs(12) }]}>
              Asistencia
            </Text>
            <Text style={[styles.kpiValue, { color: theme.accent, fontSize: fs(26) }]}>
              {alumno.asistencia}%
            </Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.kpiLabel, { color: theme.textSec, fontSize: fs(12) }]}>
              Meses pagados
            </Text>
            <Text style={[styles.kpiValue, { color: theme.accent, fontSize: fs(26) }]}>
              {Object.values(alumno.pagos).filter(Boolean).length}
            </Text>
          </View>
        </View>

        {/* Próximas clases */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
          Próximas clases
        </Text>
        {PROXIMAS_CLASES.map((clase) => (
          <View key={clase.id} style={[styles.claseRow, { backgroundColor: theme.surface1 }]}>
            <View style={[styles.claseFecha, { backgroundColor: theme.accentDark }]}>
              <Text style={[styles.claseDia, { fontSize: fs(9) }]}>{clase.dia.slice(0,3).toUpperCase()}</Text>
              <Text style={[styles.claseNum, { fontSize: fs(14) }]}>{clase.fecha.split(' ')[0]}</Text>
            </View>
            <View style={styles.claseInfo}>
              <Text style={[styles.claseTitle, { color: theme.textPrim, fontSize: fs(14) }]}>
                Entrenamiento {alumno.categoria}
              </Text>
              <Text style={[styles.claseSub, { color: theme.textSec, fontSize: fs(12) }]}>
                {clase.hora} · {clase.lugar}
              </Text>
            </View>
            <View style={[styles.claseTag, { backgroundColor: 'rgba(61,220,132,0.1)' }]}>
              <Text style={[styles.claseTagText, { color: theme.accent, fontSize: fs(11) }]}>Clase</Text>
            </View>
          </View>
        ))}

        {/* Botón ver ranking */}
        <TouchableOpacity
          style={[styles.rankingBtn, { backgroundColor: theme.accentDark }]}
          onPress={() => navigation.navigate('RankingTab')}
        >
          <Text style={[styles.rankingBtnText, { fontSize: fs(14) }]}>
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
    backgroundColor: 'rgba(245,166,35,0.1)',
    borderColor: '#F5A623', borderWidth: 1,
    borderRadius: 12, padding: 16, marginBottom: 20, gap: 6,
  },
  alertTitle: { color: '#F5A623', fontWeight: 'bold' },
  alertText: { color: '#F5A623' },
  alertBtn: {
    alignSelf: 'flex-start', backgroundColor: '#F5A623',
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginTop: 4,
  },
  alertBtnText: { color: '#0B0F14', fontWeight: 'bold' },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  kpiCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 6 },
  kpiLabel: {},
  kpiValue: { fontWeight: 'bold' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  claseRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, padding: 12, marginBottom: 8, gap: 12,
  },
  claseFecha: {
    width: 44, height: 44, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  claseDia: { color: '#fff', fontWeight: 'bold' },
  claseNum: { color: '#fff', fontWeight: 'bold' },
  claseInfo: { flex: 1 },
  claseTitle: { fontWeight: '500' },
  claseSub: { marginTop: 2 },
  claseTag: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  claseTagText: { fontWeight: 'bold' },
  rankingBtn: {
    borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16,
  },
  rankingBtnText: { color: '#fff', fontWeight: 'bold' },
});
