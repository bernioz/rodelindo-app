import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { categorias, getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

function ListaAsistencia({ categoria, onVolver, theme, fontSize }) {
  const { getByCategoria } = useAlumnos();
  const alumnos = getByCategoria(categoria);
  const [asistencia, setAsistencia] = useState(
    Object.fromEntries(alumnos.map((a) => [a.id, false]))
  );

  const toggle = (id) => setAsistencia((prev) => ({ ...prev, [id]: !prev[id] }));
  const presentes = Object.values(asistencia).filter(Boolean).length;
  const total = alumnos.length;

  const guardar = () => {
    Alert.alert('Asistencia guardada ✓',
      `${presentes} de ${total} presentes en ${categoria}.`,
      [{ text: 'OK' }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title={`Asistencia ${categoria}`}
        subtitle={new Date().toLocaleDateString('es-CL')} />
      <View style={styles.backRow}>
        <TouchableOpacity onPress={onVolver} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.accent }]}>‹ Cambiar categoría</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.counter, { backgroundColor: theme.surface1 }]}>
        <Text>
          <Text style={[styles.counterNum, { color: theme.accent }]}>{presentes}</Text>
          <Text style={[styles.counterOf, { color: theme.textSec }]}> / {total} presentes</Text>
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progressFill, { width: total > 0 ? `${(presentes/total)*100}%` : '0%', backgroundColor: theme.accent }]} />
        </View>
      </View>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const presente = asistencia[item.id];
          return (
            <TouchableOpacity
              style={[styles.alumnoRow, { backgroundColor: theme.surface1, borderColor: theme.border },
                presente && { borderColor: theme.accentDark, backgroundColor: 'rgba(26,107,58,0.1)' }]}
              onPress={() => toggle(item.id)} activeOpacity={0.7}>
              <View style={[styles.avatar,
                { backgroundColor: presente ? theme.accentDark : theme.surface2 }]}>
                <Text style={styles.avatarText}>{getIniciales(item.nombre_completo)}</Text>
              </View>
              <View style={styles.alumnoInfo}>
                <Text style={[styles.alumnoNombre, { color: theme.textPrim, fontSize: 15 * fontSize }]}>
                  {item.nombre_completo}
                </Text>
                <Text style={[styles.alumnoAsist, { color: theme.textSec, fontSize: 12 * fontSize }]}>
                  {item.asistencia}% histórico
                </Text>
              </View>
              <View style={[styles.checkbox, { borderColor: theme.border },
                presente && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}>
                {presente && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.surface1 }]}>
        <TouchableOpacity style={[styles.guardarBtn, { backgroundColor: theme.accent }]} onPress={guardar}>
          <Text style={styles.guardarText}>Guardar asistencia — {categoria}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AsistenciaScreen() {
  const { theme, fontSize } = useTheme();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const { getByCategoria } = useAlumnos();

  if (categoriaSeleccionada) {
    return <ListaAsistencia categoria={categoriaSeleccionada}
      onVolver={() => setCategoriaSeleccionada(null)} theme={theme} fontSize={fontSize} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Asistencia"
        subtitle={new Date().toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' })} />
      <FlatList
        data={categorias}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.lista}
        renderItem={({ item: cat }) => {
          const n = getByCategoria(cat).length;
          return (
            <TouchableOpacity
              style={[styles.catCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={() => setCategoriaSeleccionada(cat)} activeOpacity={0.75}>
              <View style={[styles.catIcon, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                <Text style={styles.catIconText}>⚽</Text>
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catNombre, { color: theme.textPrim, fontSize: 17 * fontSize }]}>{cat}</Text>
                <Text style={[styles.catAlumnos, { color: theme.textSec, fontSize: 12 * fontSize }]}>{n} alumnos</Text>
              </View>
              <Text style={[styles.catArrow, { color: theme.accent }]}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backRow: { paddingHorizontal: 20, paddingTop: 12 },
  backBtn: {},
  backText: { fontSize: 15 },
  lista: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 },
  catCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 10, gap: 14, borderWidth: 1 },
  catIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  catIconText: { fontSize: 20 },
  catInfo: { flex: 1 },
  catNombre: { fontWeight: 'bold' },
  catAlumnos: { marginTop: 2 },
  catArrow: { fontSize: 24 },
  counter: { marginHorizontal: 20, marginVertical: 12, borderRadius: 12, padding: 16, gap: 10 },
  counterNum: { fontSize: 28, fontWeight: 'bold' },
  counterOf: { fontSize: 16 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  alumnoRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 10, gap: 12, borderWidth: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  alumnoInfo: { flex: 1 },
  alumnoNombre: { fontWeight: '500' },
  alumnoAsist: { marginTop: 2 },
  checkbox: { width: 26, height: 26, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  guardarBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  guardarText: { color: '#0B0F14', fontSize: 16, fontWeight: 'bold' },
});
