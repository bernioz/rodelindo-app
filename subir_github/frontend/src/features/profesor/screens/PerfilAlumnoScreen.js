import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { mesesAdeudados, textoDeuda, contarPagados } from '../../../utils/pagos';
import { meses } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';
import Avatar from '../../../components/Avatar';
import CalendarioAsistencia from '../../../components/CalendarioAsistencia';

const POSICIONES = ['Delantero', 'Mediocampista', 'Defensa', 'Portero'];

export default function PerfilAlumnoScreen({ route, navigation }) {
  const { theme, fontSize } = useTheme();
  const { alumnos, actualizarPago, actualizarAlumno } = useAlumnos();
  const alumno = alumnos.find((a) => a.id === route.params.alumnoId);

  const [modalDeporte, setModalDeporte] = useState(false);
  const [formDeporte, setFormDeporte] = useState({
    goles: '0',
    partidos: '0',
    numero_camiseta: '10',
    posicion: 'Delantero',
  });

  if (!alumno) return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={{ color: theme.textSec, padding: 24 }}>Alumno no encontrado.</Text>
    </View>
  );

  const fs = (s) => s * fontSize;

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const mesesPagados = contarPagados(alumno.pagos);
  const debe = mesesAdeudados(alumno.pagos).length;

  const mesEstilos = (pagado) => {
    if (pagado === true)  return { bg: 'rgba(61,220,132,0.15)', color: '#3DDC84', simbolo: '✓' };
    if (pagado === false) return { bg: 'rgba(255,90,95,0.15)',  color: '#FF5A5F', simbolo: '✗' };
    if (pagado === 'na')  return { bg: theme.surface2, color: theme.textMuted, simbolo: 'N/A' };
    return { bg: theme.surface2, color: theme.textMuted, simbolo: '–' };
  };

  const ajustarStat = (campo, delta) => {
    const actual = alumno[campo] ?? 0;
    const nuevo = Math.max(0, actual + delta);
    actualizarAlumno(alumno.id, { [campo]: nuevo });
  };

  const abrirModalDeporte = () => {
    setFormDeporte({
      goles: String(alumno.goles ?? 0),
      partidos: String(alumno.partidos ?? 0),
      numero_camiseta: String(alumno.numero_camiseta ?? 10),
      posicion: alumno.posicion || 'Delantero',
    });
    setModalDeporte(true);
  };

  const guardarDeporte = () => {
    actualizarAlumno(alumno.id, {
      goles: Math.max(0, parseInt(formDeporte.goles, 10) || 0),
      partidos: Math.max(0, parseInt(formDeporte.partidos, 10) || 0),
      numero_camiseta: Math.max(1, parseInt(formDeporte.numero_camiseta, 10) || 10),
      posicion: formDeporte.posicion,
    });
    setModalDeporte(false);
    Alert.alert('Actualizado', `Ficha deportiva de ${alumno.nombre_completo} guardada.`);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.content}>
        <ScreenHeader title={alumno.nombre_completo} subtitle={alumno.categoria} />

        <View style={styles.inner}>

          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.accent }]}>‹ Volver</Text>
          </TouchableOpacity>

          {/* Avatar */}
          <View style={styles.profileHeader}>
            <Avatar alumno={alumno} size={72} />
            <Text style={[styles.nombre, { color: theme.textPrim, fontSize: fs(22) }]}>
              {alumno.nombre_completo}
            </Text>
            <View style={styles.badgesRow}>
              <View style={[styles.catBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                <Text style={[styles.catBadgeText, { color: theme.accent }]}>{alumno.categoria}</Text>
              </View>
              <View style={[styles.catBadge, { backgroundColor: theme.surface2 }]}>
                <Text style={[styles.catBadgeText, { color: theme.textPrim }]}>
                  #{alumno.numero_camiseta || 10} · {alumno.posicion || 'Delantero'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Resumen */}
          <View style={styles.statsRow}>
            {[
              { val: `${alumno.asistencia}%`, label: 'Asistencia',    color: colorPct(alumno.asistencia) },
              { val: mesesPagados,             label: 'Meses pagados', color: theme.accent },
              { val: alumno.matricula ? '✓' : '✗', label: 'Matrícula',
                color: alumno.matricula ? theme.accent : '#FF5A5F' },
            ].map((s, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: theme.surface1 }]}>
                <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(10) }]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Ficha Deportiva Editable por el Profesor */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16), marginBottom: 0 }]}>
              Ficha deportiva
            </Text>
            <TouchableOpacity onPress={abrirModalDeporte}>
              <Text style={{ color: theme.accent, fontSize: fs(13), fontWeight: 'bold' }}>Editar datos ✏️</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.deporteCard, { backgroundColor: theme.surface1 }]}>
            <View style={styles.stepperGrid}>
              {/* Control rápido de Goles */}
              <View style={[styles.stepperBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Text style={[styles.stepperLabel, { color: theme.textSec, fontSize: fs(11) }]}>⚽ Goles</Text>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: theme.surface2 }]}
                    onPress={() => ajustarStat('goles', -1)}
                  >
                    <Text style={[styles.stepBtnText, { color: theme.textPrim }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepperVal, { color: theme.accent, fontSize: fs(20) }]}>
                    {alumno.goles ?? 0}
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: theme.accentDark }]}
                    onPress={() => ajustarStat('goles', 1)}
                  >
                    <Text style={[styles.stepBtnText, { color: '#fff' }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Control rápido de Partidos */}
              <View style={[styles.stepperBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Text style={[styles.stepperLabel, { color: theme.textSec, fontSize: fs(11) }]}>🏃 Partidos</Text>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: theme.surface2 }]}
                    onPress={() => ajustarStat('partidos', -1)}
                  >
                    <Text style={[styles.stepBtnText, { color: theme.textPrim }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepperVal, { color: theme.accent, fontSize: fs(20) }]}>
                    {alumno.partidos ?? 0}
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: theme.accentDark }]}
                    onPress={() => ajustarStat('partidos', 1)}
                  >
                    <Text style={[styles.stepBtnText, { color: '#fff' }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.deporteMetaRow, { borderTopColor: theme.border }]}>
              <Text style={{ color: theme.textSec, fontSize: fs(12) }}>
                Dorsal: <Text style={{ color: theme.textPrim, fontWeight: 'bold' }}>#{alumno.numero_camiseta || 10}</Text>
              </Text>
              <Text style={{ color: theme.textSec, fontSize: fs(12) }}>
                Posición: <Text style={{ color: theme.textPrim, fontWeight: 'bold' }}>{alumno.posicion || 'Delantero'}</Text>
              </Text>
            </View>
          </View>

          {/* Calendario de asistencia */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Asistencia por día
          </Text>
          <CalendarioAsistencia alumnoId={alumno.id} />

          {/* Pagos */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Estado de pagos {new Date().getFullYear()}
          </Text>
          <View style={[styles.pagosCard, { backgroundColor: theme.surface1 }]}>

            {/* Matrícula — automática (no se edita a mano) */}
            <View style={styles.matriculaRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.pagosLabel, { color: theme.textPrim }]}>Matrícula</Text>
                <Text style={[styles.tapHint, { color: theme.textMuted }]}>
                  Automática: al día cuando todos los meses hasta hoy están pagados o "no aplica"
                </Text>
              </View>
              <View style={[styles.estadoBadge,
                alumno.matricula ? styles.badgePagado : styles.badgePendiente]}>
                <Text style={[styles.estadoBadgeText,
                  alumno.matricula ? styles.badgeTextPagado : styles.badgeTextPendiente]}>
                  {alumno.matricula ? 'Al día ✓' : textoDeuda(debe)}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Meses — cada uno clickeable */}
            <Text style={[styles.mesesHint, { color: theme.textMuted }]}>
              Toca un mes para cambiar su estado
            </Text>
            <View style={styles.mesesGrid}>
              {Object.entries(meses).map(([num, nombre]) => {
                const numInt = parseInt(num);
                const pagado = alumno.pagos[numInt];
                const { bg, color, simbolo } = mesEstilos(pagado);
                return (
                  <TouchableOpacity
                    key={num}
                    style={[styles.mesCard, { backgroundColor: bg }]}
                    onPress={() => actualizarPago(alumno.id, numInt)}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.mesNombre, { color }]}>{nombre}</Text>
                    <Text style={[styles.mesEstado, { color }]}>{simbolo}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Leyenda */}
          <View style={styles.leyenda}>
            {[
              { color: 'rgba(61,220,132,0.3)', label: 'Pagado (✓)' },
              { color: 'rgba(255,90,95,0.3)',  label: 'Pendiente (✗)' },
              { color: theme.surface2,          label: 'Sin definir (–) / No aplica (N/A)' },
            ].map((l) => (
              <View key={l.label} style={styles.leyendaItem}>
                <View style={[styles.leyendaDot, { backgroundColor: l.color }]} />
                <Text style={[styles.leyendaText, { color: theme.textSec }]}>{l.label}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* Modal Edición Completa de Ficha Deportiva */}
      <Modal visible={modalDeporte} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>
              Editar Ficha Deportiva
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalLabel, { color: theme.textSec }]}>Goles marcados</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                  value={formDeporte.goles}
                  onChangeText={(t) => setFormDeporte((p) => ({ ...p, goles: t.replace(/[^0-9]/g, '') }))}
                  keyboardType="number-pad"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.modalLabel, { color: theme.textSec }]}>Partidos jugados</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                  value={formDeporte.partidos}
                  onChangeText={(t) => setFormDeporte((p) => ({ ...p, partidos: t.replace(/[^0-9]/g, '') }))}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Número de camiseta</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
              value={formDeporte.numero_camiseta}
              onChangeText={(t) => setFormDeporte((p) => ({ ...p, numero_camiseta: t.replace(/[^0-9]/g, '') }))}
              keyboardType="number-pad"
            />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Posición en cancha</Text>
            <View style={styles.posChipsRow}>
              {POSICIONES.map((pos) => {
                const activa = formDeporte.posicion === pos;
                return (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.posChip,
                      { backgroundColor: theme.bg, borderColor: theme.border },
                      activa && { backgroundColor: theme.accentDark, borderColor: theme.accent },
                    ]}
                    onPress={() => setFormDeporte((p) => ({ ...p, posicion: pos }))}
                  >
                    <Text style={{ color: activa ? '#fff' : theme.textSec, fontSize: 12, fontWeight: 'bold' }}>
                      {pos}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => setModalDeporte(false)}
              >
                <Text style={{ color: theme.textSec }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={guardarDeporte}>
                <Text style={styles.modalSaveText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  inner: { padding: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 17 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  nombre: { fontWeight: 'bold', textAlign: 'center', marginTop: 12 },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  catBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 },
  catBadgeText: { fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  deporteCard: { borderRadius: 12, padding: 14, marginBottom: 24, gap: 12 },
  stepperGrid: { flexDirection: 'row', gap: 10 },
  stepperBox: { flex: 1, borderRadius: 10, padding: 12, borderWidth: 1, alignItems: 'center', gap: 8 },
  stepperLabel: { fontWeight: 'bold' },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 18, fontWeight: 'bold' },
  stepperVal: { fontWeight: 'bold', minWidth: 26, textAlign: 'center' },
  deporteMetaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1 },
  pagosCard: { borderRadius: 12, padding: 16, marginBottom: 12 },
  matriculaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  pagosLabel: { fontSize: 14, fontWeight: '500' },
  tapHint: { fontSize: 10, marginTop: 2 },
  estadoBadge: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12 },
  badgePagado: { backgroundColor: 'rgba(61,220,132,0.15)' },
  badgePendiente: { backgroundColor: 'rgba(255,90,95,0.15)' },
  estadoBadgeText: { fontSize: 12, fontWeight: 'bold' },
  badgeTextPagado: { color: '#3DDC84' },
  badgeTextPendiente: { color: '#FF5A5F' },
  divider: { height: 1, marginBottom: 10 },
  mesesHint: { fontSize: 10, marginBottom: 10 },
  mesesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mesCard: {
    width: '13%', aspectRatio: 1, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    gap: 2, minWidth: 40,
  },
  mesNombre: { fontSize: 9, fontWeight: 'bold' },
  mesEstado: { fontSize: 12, fontWeight: 'bold' },
  leyenda: { flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leyendaDot: { width: 10, height: 10, borderRadius: 3 },
  leyendaText: { fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalLabel: { fontSize: 12, marginBottom: 6, marginTop: 12 },
  modalInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  posChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  posChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontSize: 15, fontWeight: 'bold' },
});