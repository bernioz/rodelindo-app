import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { meses, getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

export default function PerfilAlumnoScreen({ route, navigation }) {
  const { theme, fontSize } = useTheme();
  const { alumnos, actualizarPago, actualizarMatricula } = useAlumnos();
  const alumno = alumnos.find((a) => a.id === route.params.alumnoId);

  if (!alumno) return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={{ color: theme.textSec, padding: 24 }}>Alumno no encontrado.</Text>
    </View>
  );

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const mesesPagados = Object.values(alumno.pagos).filter((v) => v === true).length;

  // Estilos dinámicos por estado de mes
  const mesEstilos = (pagado) => {
    if (pagado === true)  return { bg: 'rgba(61,220,132,0.15)', color: '#3DDC84', simbolo: '✓' };
    if (pagado === false) return { bg: 'rgba(255,90,95,0.15)',  color: '#FF5A5F', simbolo: '✗' };
    return { bg: theme.surface2, color: theme.textMuted, simbolo: '–' };
  };

  return (
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
          <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
            <Text style={styles.avatarText}>{getIniciales(alumno.nombre_completo)}</Text>
          </View>
          <Text style={[styles.nombre, { color: theme.textPrim, fontSize: 22 * fontSize }]}>
            {alumno.nombre_completo}
          </Text>
          <View style={[styles.catBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
            <Text style={[styles.catBadgeText, { color: theme.accent }]}>{alumno.categoria}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { val: `${alumno.asistencia}%`, label: 'Asistencia',    color: colorPct(alumno.asistencia) },
            { val: mesesPagados,             label: 'Meses pagados', color: theme.accent },
            { val: alumno.matricula ? '✓' : '✗', label: 'Matrícula',
              color: alumno.matricula ? theme.accent : '#FF5A5F' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.surface1 }]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={[styles.statLabel, { color: theme.textSec, fontSize: 10 * fontSize }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Pagos */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: 16 * fontSize }]}>
          Estado de pagos 2025
        </Text>
        <View style={[styles.pagosCard, { backgroundColor: theme.surface1 }]}>

          {/* Matrícula — clickeable */}
          <TouchableOpacity
            style={styles.matriculaRow}
            onPress={() => actualizarMatricula(alumno.id)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.pagosLabel, { color: theme.textPrim }]}>Matrícula</Text>
              <Text style={[styles.tapHint, { color: theme.textMuted }]}>Toca para cambiar</Text>
            </View>
            <View style={[styles.estadoBadge,
              alumno.matricula ? styles.badgePagado : styles.badgePendiente]}>
              <Text style={[styles.estadoBadgeText,
                alumno.matricula ? styles.badgeTextPagado : styles.badgeTextPendiente]}>
                {alumno.matricula ? 'Pagada ✓' : 'Pendiente ✗'}
              </Text>
            </View>
          </TouchableOpacity>

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
            { color: theme.surface2,          label: 'Sin definir (–)' },
          ].map((l) => (
            <View key={l.label} style={styles.leyendaItem}>
              <View style={[styles.leyendaDot, { backgroundColor: l.color }]} />
              <Text style={[styles.leyendaText, { color: theme.textSec }]}>{l.label}</Text>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 60 },
  inner: { padding: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 17 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  nombre: { fontWeight: 'bold', textAlign: 'center' },
  catBadge: { marginTop: 8, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 },
  catBadgeText: { fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { textAlign: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
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
});
