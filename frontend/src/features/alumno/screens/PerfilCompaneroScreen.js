import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

export default function PerfilCompaneroScreen({ route, navigation }) {
  const { theme, fontSize } = useTheme();
  const { alumnos, getByCategoria } = useAlumnos();

  // Recibe el alumnoSeleccionado enviado desde el Ranking por parametros de navegacion
  const alumnoId = route?.params?.alumnoId;
  const alumno = alumnos.find((a) => a.id === alumnoId);

  if (!alumno) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.textPrim }}>Alumno no encontrado</Text>
      </View>
    );
  }

  const fs = (s) => s * fontSize;

  // Cálculo de posición en el ranking de su categoría
  const rankingCat = [...getByCategoria(alumno.categoria)].sort((a, b) => b.asistencia - a.asistencia);
  const posRanking = rankingCat.findIndex((a) => a.id === alumno.id) + 1;

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Perfil de Compañero" subtitle="Ficha Pública del Jugador" />

      <View style={styles.inner}>
        {/* Botón Volver al Ranking */}
        <TouchableOpacity style={[styles.backBtn, { borderColor: theme.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: theme.accent, fontSize: fs(13) }]}>← Volver al Ranking</Text>
        </TouchableOpacity>

        {/* Header del Perfil del Compañero */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
            <Text style={[styles.avatarText, { fontSize: fs(28) }]}>
              {getIniciales(alumno.nombre_completo)}
            </Text>
          </View>

          <Text style={[styles.nombre, { color: theme.textPrim, fontSize: fs(22) }]}>
            {alumno.nombre_completo}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.catBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
              <Text style={[styles.catBadgeText, { color: theme.accent, fontSize: fs(12) }]}>
                {alumno.categoria}
              </Text>
            </View>
            <View style={[styles.catBadge, { backgroundColor: theme.surface2 }]}>
              <Text style={[styles.catBadgeText, { color: theme.textPrim, fontSize: fs(12) }]}>
                #{alumno.numero_camiseta || 10} · {alumno.posicion || 'Jugador'}
              </Text>
            </View>
          </View>
        </View>

        {/* Estadísticas de la Temporada */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
          Estadísticas de la Temporada
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCardBig, { backgroundColor: theme.surface1 }]}>
            <Text style={{ fontSize: 24 }}>⚽</Text>
            <Text style={[styles.statValBig, { color: theme.accent, fontSize: fs(24) }]}>
              {alumno.goles ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(11) }]}>
              Goles Marcados
            </Text>
          </View>

          <View style={[styles.statCardBig, { backgroundColor: theme.surface1 }]}>
            <Text style={{ fontSize: 24 }}>🏃</Text>
            <Text style={[styles.statValBig, { color: theme.accent, fontSize: fs(24) }]}>
              {alumno.partidos ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(11) }]}>
              Partidos Jugados
            </Text>
          </View>

          <View style={[styles.statCardBig, { backgroundColor: theme.surface1 }]}>
            <Text style={{ fontSize: 24 }}>📊</Text>
            <Text style={[styles.statValBig, { color: colorPct(alumno.asistencia), fontSize: fs(24) }]}>
              {alumno.asistencia}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(11) }]}>
              Asistencia
            </Text>
          </View>

          <View style={[styles.statCardBig, { backgroundColor: theme.surface1 }]}>
            <Text style={{ fontSize: 24 }}>🏆</Text>
            <Text style={[styles.statValBig, { color: '#F5A623', fontSize: fs(24) }]}>
              #{posRanking}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(11) }]}>
              Lugar en Ranking
            </Text>
          </View>
        </View>

        {/* Ficha de Jugador */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
          Ficha de Jugador
        </Text>
        <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
          {[
            { k: 'Número de Camiseta', v: `#${alumno.numero_camiseta || 10}` },
            { k: 'Posición Principal', v: alumno.posicion || 'Delantero' },
            { k: 'Categoría',          v: alumno.categoria },
            { k: 'Club',               v: 'FC Rodelindo Román' },
          ].map(({ k, v }) => (
            <View key={k} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoKey, { color: theme.textSec, fontSize: fs(13) }]}>{k}</Text>
              <Text style={[styles.infoVal, { color: theme.textPrim, fontSize: fs(13) }]}>{v}</Text>
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
  backBtn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  backBtnText: { fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  nombre: { fontWeight: 'bold', textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  catBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  catBadgeText: { fontWeight: 'bold' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCardBig: { width: '48%', borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statValBig: { fontWeight: 'bold' },
  statLabel: { textAlign: 'center' },
  infoCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1 },
  infoKey: {},
  infoVal: { fontWeight: '500' },
});