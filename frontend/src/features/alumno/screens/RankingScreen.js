import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { getByCategoria } = useAlumnos();

  const alumno = getByCategoria(user.categoria ?? 'Sub-12')
    .find((a) => a.id === user.alumnoId);

  const ranking = [...getByCategoria(user.categoria ?? 'Sub-12')]
    .sort((a, b) => b.asistencia - a.asistencia);

  const posicion = ranking.findIndex((a) => a.id === user.alumnoId) + 1;

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const fs = (s) => s * fontSize;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title={`Ranking ${user.categoria ?? 'Sub-12'}`}
        subtitle="Asistencia · Temporada 2025"
      />

      {/* Tu posición */}
      {alumno && (
        <View style={[styles.miPosicion, { backgroundColor: theme.accentDark }]}>
          <Text style={[styles.miPosLabel, { fontSize: fs(12) }]}>Tu posición</Text>
          <View style={styles.miPosRow}>
            <Text style={[styles.miPosNum, { fontSize: fs(36) }]}>
              {posicion <= 3 ? MEDALLAS[posicion - 1] : `#${posicion}`}
            </Text>
            <View style={styles.miPosInfo}>
              <Text style={[styles.miPosNombre, { fontSize: fs(16) }]}>
                {alumno.nombre_completo.split(' ')[0]}
              </Text>
              <Text style={[styles.miPosAsist, { fontSize: fs(22) }]}>
                {alumno.asistencia}%
              </Text>
            </View>
            <View style={styles.miPosBarra}>
              <Text style={[styles.miPosBarraLabel, { fontSize: fs(10) }]}>
                de {ranking.length} alumnos
              </Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => {
          const esTuyo = item.id === user.alumnoId;
          return (
            <View style={[
              styles.rankRow,
              { backgroundColor: esTuyo ? 'rgba(26,107,58,0.2)' : theme.surface1 },
              esTuyo && { borderWidth: 1, borderColor: theme.accentDark },
            ]}>
              {/* Posición */}
              <View style={styles.rankPos}>
                {index < 3
                  ? <Text style={[styles.rankMedalla, { fontSize: fs(20) }]}>{MEDALLAS[index]}</Text>
                  : <Text style={[styles.rankNum, { color: theme.textMuted, fontSize: fs(16) }]}>
                      #{index + 1}
                    </Text>
                }
              </View>

              {/* Avatar */}
              <View style={[styles.avatar,
                { backgroundColor: esTuyo ? theme.accentDark : theme.surface2 }]}>
                <Text style={[styles.avatarText, { fontSize: fs(13) }]}>
                  {getIniciales(item.nombre_completo)}
                </Text>
              </View>

              {/* Nombre */}
              <View style={styles.rankInfo}>
                <Text style={[styles.rankNombre, { color: theme.textPrim, fontSize: fs(14) }]}>
                  {item.nombre_completo}
                  {esTuyo && <Text style={{ color: theme.accent }}> (tú)</Text>}
                </Text>
              </View>

              {/* % + barra */}
              <View style={styles.rankDerecha}>
                <Text style={[styles.rankPct, { color: colorPct(item.asistencia), fontSize: fs(16) }]}>
                  {item.asistencia}%
                </Text>
                <View style={[styles.barraFondo, { backgroundColor: theme.border }]}>
                  <View style={[styles.barraFill, {
                    width: `${item.asistencia}%`,
                    backgroundColor: colorPct(item.asistencia),
                  }]} />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  miPosicion: { margin: 20, borderRadius: 14, padding: 16 },
  miPosLabel: { color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  miPosRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  miPosNum: { color: '#fff', fontWeight: 'bold' },
  miPosInfo: { flex: 1 },
  miPosNombre: { color: '#fff', fontWeight: 'bold' },
  miPosAsist: { color: '#3DDC84', fontWeight: 'bold' },
  miPosBarra: { alignItems: 'flex-end' },
  miPosBarraLabel: { color: 'rgba(255,255,255,0.6)' },
  lista: { paddingHorizontal: 20, paddingBottom: 40 },
  rankRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, padding: 12, marginBottom: 8, gap: 10,
  },
  rankPos: { width: 32, alignItems: 'center' },
  rankMedalla: {},
  rankNum: { fontWeight: 'bold' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  rankInfo: { flex: 1 },
  rankNombre: { fontWeight: '500' },
  rankDerecha: { alignItems: 'flex-end', gap: 4, minWidth: 60 },
  rankPct: { fontWeight: 'bold' },
  barraFondo: { width: 60, height: 4, borderRadius: 2, overflow: 'hidden' },
  barraFill: { height: '100%', borderRadius: 2 },
});
