import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import ScreenHeader from '../../../components/ScreenHeader';
import Avatar from '../../../components/Avatar';

const MEDALLAS = ['🥇', '🥈', '🥉'];
const CATEGORIAS_FILTRO = ['Todas', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];

export default function RankingScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { alumnos, getByCategoria } = useAlumnos();

  const miCategoria = user.categoria ?? 'Sub-12';
  const [catFiltro, setCatFiltro] = useState(miCategoria);

  const alumno = getByCategoria(miCategoria).find((a) => a.id === user.alumnoId);
  const miRanking = [...getByCategoria(miCategoria)].sort((a, b) => b.asistencia - a.asistencia);
  const miPosicion = miRanking.findIndex((a) => a.id === user.alumnoId) + 1;

  const listaBase = catFiltro === 'Todas' ? alumnos : getByCategoria(catFiltro);
  const ranking = [...listaBase].sort((a, b) => b.asistencia - a.asistencia);

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const fs = (s) => s * fontSize;

  // Tu fila lleva a tu perfil; las demás, a la ficha pública del compañero
  const verPerfilAlumno = (item, esTuyo) => {
    if (esTuyo) navigation.navigate('PerfilTab');
    else navigation.navigate('PerfilCompanero', { alumnoId: item.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title={catFiltro === 'Todas' ? 'Ranking General' : `Ranking ${catFiltro}`}
        subtitle={catFiltro === 'Todas' ? 'Todas las categorías · Temporada 2026' : `Asistencia ${catFiltro} · Temporada 2026`}
      />

      {/* Tu posición en tu categoría */}
      {alumno && (
        <TouchableOpacity
          style={[styles.miPosicion, { backgroundColor: theme.accentDark }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PerfilTab')}
        >
          <Text style={[styles.miPosLabel, { fontSize: fs(12) }]}>
            Tu posición en {miCategoria} (Toca para ver)
          </Text>
          <View style={styles.miPosRow}>
            <Text style={[styles.miPosNum, { fontSize: fs(36) }]}>
              {miPosicion <= 3 ? MEDALLAS[miPosicion - 1] : `#${miPosicion}`}
            </Text>
            <View style={styles.miPosInfo}>
              <Text style={[styles.miPosNombre, { fontSize: fs(16) }]}>
                {alumno.nombre_completo.split(' ')[0]}
              </Text>
              <Text style={[styles.miPosAsist, { fontSize: fs(22) }]}>{alumno.asistencia}%</Text>
            </View>
            <View style={styles.miPosBarra}>
              <Text style={[styles.miPosBarraLabel, { fontSize: fs(10) }]}>
                de {miRanking.length} alumnos
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Selector de Categorías (Todas o Sub-8 a Sub-16) */}
      <View style={styles.filtroWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroRow}
        >
          {CATEGORIAS_FILTRO.map((cat) => {
            const activo = catFiltro === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCatFiltro(cat)}
                style={[
                  styles.chip,
                  { backgroundColor: theme.surface1, borderColor: theme.border },
                  activo && { backgroundColor: theme.accentDark, borderColor: theme.accent },
                ]}
              >
                <Text
                  style={{
                    fontSize: fs(12),
                    color: activo ? '#fff' : theme.textSec,
                    fontWeight: activo ? 'bold' : '500',
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={[styles.hint, { color: theme.textMuted, fontSize: fs(11) }]}>
        Toca a un compañero para ver su perfil
      </Text>

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => {
          const esTuyo = item.id === user.alumnoId;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => verPerfilAlumno(item, esTuyo)}
              style={[
                styles.rankRow,
                { backgroundColor: esTuyo ? 'rgba(26,107,58,0.2)' : theme.surface1 },
                esTuyo && { borderWidth: 1, borderColor: theme.accentDark },
              ]}
            >
              {/* Posición */}
              <View style={styles.rankPos}>
                {index < 3
                  ? <Text style={[styles.rankMedalla, { fontSize: fs(20) }]}>{MEDALLAS[index]}</Text>
                  : <Text style={[styles.rankNum, { color: theme.textMuted, fontSize: fs(16) }]}>
                      #{index + 1}
                    </Text>
                }
              </View>

              <Avatar alumno={item} size={36} highlight={esTuyo} />

              {/* Nombre y serie */}
              <View style={styles.rankInfo}>
                <Text style={[styles.rankNombre, { color: theme.textPrim, fontSize: fs(14) }]}>
                  {item.nombre_completo}
                  {esTuyo && <Text style={{ color: theme.accent }}> (tú)</Text>}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: fs(11), marginTop: 2 }}>
                  {catFiltro === 'Todas' ? `${item.categoria} · ` : ''}#{item.numero_camiseta || 10} · {item.posicion || 'Jugador'}
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
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  miPosicion: { marginHorizontal: 20, marginTop: 14, marginBottom: 6, borderRadius: 14, padding: 16 },
  miPosLabel: { color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  miPosRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  miPosNum: { color: '#fff', fontWeight: 'bold' },
  miPosInfo: { flex: 1 },
  miPosNombre: { color: '#fff', fontWeight: 'bold' },
  miPosAsist: { color: '#3DDC84', fontWeight: 'bold' },
  miPosBarra: { alignItems: 'flex-end' },
  miPosBarraLabel: { color: 'rgba(255,255,255,0.6)' },
  filtroWrap: { height: 46, flexShrink: 0, marginTop: 4 },
  filtroRow: { paddingHorizontal: 20, gap: 8, alignItems: 'center', paddingVertical: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  hint: { textAlign: 'center', marginTop: 4, marginBottom: 8 },
  lista: { paddingHorizontal: 20, paddingBottom: 40 },
  rankRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 8, gap: 10 },
  rankPos: { width: 32, alignItems: 'center' },
  rankMedalla: {},
  rankNum: { fontWeight: 'bold' },
  rankInfo: { flex: 1 },
  rankNombre: { fontWeight: '500' },
  rankDerecha: { alignItems: 'flex-end', gap: 4, minWidth: 60 },
  rankPct: { fontWeight: 'bold' },
  barraFondo: { width: 60, height: 4, borderRadius: 2, overflow: 'hidden' },
  barraFill: { height: '100%', borderRadius: 2 },
});