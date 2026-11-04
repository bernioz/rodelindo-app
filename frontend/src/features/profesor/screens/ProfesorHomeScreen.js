import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useEventos } from '../../../context/EventosContext';
import ScreenHeader from '../../../components/ScreenHeader';
import EventoRow from '../../../components/EventoRow';
import EventoModal from '../../../components/EventoModal';
import { hoyKey, addDias, formatLargo } from '../../../utils/fechas';

export default function ProfesorHomeScreen() {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { getEventosDia, getProximos } = useEventos();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);

  const hoy = hoyKey();
  const eventosHoy = getEventosDia(hoy);
  const proximos = getProximos(addDias(hoy, 1), undefined, 8);

  const fs = (s) => s * fontSize;
  const abrirNuevo = () => { setEditando(null); setModalVisible(true); };
  const abrirEditar = (ev) => { setEditando(ev); setModalVisible(true); };

  const acciones = [
    { icono: '👥', label: 'Alumnos', onPress: () => navigation.navigate('AlumnosTab') },
    { icono: '✅', label: 'Asistencia', onPress: () => navigation.navigate('AsistenciaTab') },
    { icono: '📅', label: 'Calendario', onPress: () => navigation.navigate('Calendario') },
  ];

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
        <ScreenHeader title={`Hola, ${user.nombre} 👋`} subtitle="Panel del Profesor" />

        <View style={styles.inner}>
          {/* Acciones rápidas */}
          <View style={styles.acciones}>
            {acciones.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.accionCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
                onPress={a.onPress}
              >
                <Text style={styles.accionIcono}>{a.icono}</Text>
                <Text style={[styles.accionLabel, { color: theme.textPrim, fontSize: fs(12) }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hoy */}
          <View style={styles.seccionHeader}>
            <Text style={[styles.seccion, { color: theme.textPrim, fontSize: fs(16) }]}>
              📅 Hoy · <Text style={{ textTransform: 'capitalize', fontWeight: 'normal', color: theme.textSec }}>
                {formatLargo(hoy)}
              </Text>
            </Text>
            <TouchableOpacity onPress={abrirNuevo}>
              <Text style={{ color: theme.accent, fontSize: fs(13), fontWeight: 'bold' }}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          {eventosHoy.length === 0 ? (
            <TouchableOpacity
              style={[styles.vacio, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={abrirNuevo}
            >
              <Text style={{ color: theme.textMuted, fontSize: fs(13) }}>No hay eventos hoy</Text>
              <Text style={{ color: theme.accent, fontSize: fs(13), marginTop: 4 }}>Toca para agregar uno</Text>
            </TouchableOpacity>
          ) : (
            eventosHoy.map((ev) => (
              <EventoRow key={ev.id} ev={ev} badge="hora" destacado onPress={() => abrirEditar(ev)} />
            ))
          )}

          {/* Próximos */}
          <View style={[styles.seccionHeader, { marginTop: 22 }]}>
            <Text style={[styles.seccion, { color: theme.textPrim, fontSize: fs(16) }]}>Próximos eventos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendario')}>
              <Text style={{ color: theme.accent, fontSize: fs(13) }}>Ver calendario ›</Text>
            </TouchableOpacity>
          </View>
          {proximos.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: fs(13) }}>No hay eventos planificados.</Text>
          ) : (
            proximos.map((ev) => (
              <EventoRow key={ev.id} ev={ev} badge="fecha" onPress={() => abrirEditar(ev)} />
            ))
          )}

          <Text style={[styles.tip, { color: theme.textMuted, fontSize: fs(11) }]}>
            Toca un evento para editarlo. Todo lo que agregues aquí aparece en el calendario y lo ven los alumnos de esa categoría.
          </Text>
        </View>
      </ScrollView>

      <EventoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fechaInicial={hoy}
        evento={editando}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  inner: { padding: 24 },
  acciones: { flexDirection: 'row', gap: 10, marginBottom: 26 },
  accionCard: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  accionIcono: { fontSize: 24 },
  accionLabel: { fontWeight: 'bold' },
  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seccion: { fontWeight: 'bold' },
  vacio: { borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed' },
  tip: { textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
