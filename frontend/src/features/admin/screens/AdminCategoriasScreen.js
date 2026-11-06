import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert, Platform
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { categorias as LISTA_CATEGORIAS } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

export default function AdminCategoriasScreen({ navigation }) {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  const { alumnos, actualizarAlumno } = useAlumnos();

  // Categoría seleccionada actualmente
  const [catSeleccionada, setCatSeleccionada] = useState('Sub-12');

  // Profesores y sus categorías asignadas
  const [profesores, setProfesores] = useState([
    { id: 101, nombre_completo: 'Prof. Rodrigo Vera', categorias: ['Sub-8', 'Sub-12'] },
    { id: 102, nombre_completo: 'Prof. Marcelo Salas', categorias: ['Sub-14', 'Sub-16'] },
    { id: 103, nombre_completo: 'Prof. Claudio Bravo', categorias: ['Sub-10'] },
  ]);

  // Modal para mover alumno de categoría
  const [modalAlumno, setModalAlumno] = useState(null); // Alumno seleccionado

  const alumnosDeCategoria = alumnos.filter((a) => a.categoria === catSeleccionada);
  const profesDeCategoria = profesores.filter((p) => p.categorias.includes(catSeleccionada));

  const toggleProfeCategoria = (profeId) => {
    setProfesores((prev) =>
      prev.map((p) => {
        if (p.id !== profeId) return p;
        const yaEsta = p.categorias.includes(catSeleccionada);
        const nuevasCats = yaEsta
          ? p.categorias.filter((c) => c !== catSeleccionada)
          : [...p.categorias, catSeleccionada];
        return { ...p, categorias: nuevasCats };
      })
    );
  };

  const moverAlumno = (nuevaCat) => {
    if (!modalAlumno) return;
    actualizarAlumno(modalAlumno.id, { categoria: nuevaCat });
    Alert.alert('Éxito', `${modalAlumno.nombre_completo} ha sido trasladado a la categoría ${nuevaCat}.`);
    setModalAlumno(null);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Botón Volver con margen superior para iOS */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface1 }]} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.textPrim }}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      <ScreenHeader title="Categorías y Series" subtitle="Gestión de planteles y profesores a cargo" />

      <View style={styles.inner}>

        {/* Resumen de planteles por categoría */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(14) }]}>Selecciona una Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {LISTA_CATEGORIAS.map((cat) => {
            const count = alumnos.filter((a) => a.categoria === cat).length;
            const esActiva = catSeleccionada === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catCard,
                  { backgroundColor: theme.surface1, borderColor: theme.border },
                  esActiva && { backgroundColor: theme.accentDark, borderColor: theme.accent }
                ]}
                onPress={() => setCatSeleccionada(cat)}
              >
                <Text style={[styles.catCardTitle, { color: esActiva ? '#fff' : theme.textPrim, fontSize: fs(14) }]}>{cat}</Text>
                <Text style={[styles.catCardSub, { color: esActiva ? 'rgba(255,255,255,0.8)' : theme.textMuted, fontSize: fs(11) }]}>
                  {count} {count === 1 ? 'Alumno' : 'Alumnos'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECCIÓN 1: Cuerpo Técnico a Cargo */}
        <View style={[styles.blockCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <View style={styles.blockHeader}>
            <Text style={[styles.blockTitle, { color: theme.textPrim, fontSize: fs(15) }]}>
              👨‍🏫 Cuerpo Técnico ({catSeleccionada})
            </Text>
            <Text style={[styles.blockSub, { color: theme.textMuted, fontSize: fs(11) }]}>
              {profesDeCategoria.length} Asignado(s)
            </Text>
          </View>

          <View style={{ gap: 8, marginTop: 8 }}>
            {profesores.map((profe) => {
              const asignado = profe.categorias.includes(catSeleccionada);
              return (
                <View key={profe.id} style={[styles.itemRow, { borderColor: theme.border, backgroundColor: theme.bg }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.textPrim, fontSize: fs(13) }]}>{profe.nombre_completo}</Text>
                    <Text style={[styles.itemSub, { color: theme.textMuted, fontSize: fs(10) }]}>
                      Series: {profe.categorias.join(', ') || 'Sin serie asignada'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.assignBtn,
                      { backgroundColor: asignado ? 'rgba(255,90,95,0.15)' : 'rgba(61,220,132,0.15)' }
                    ]}
                    onPress={() => toggleProfeCategoria(profe.id)}
                  >
                    <Text style={{ color: asignado ? '#FF5A5F' : '#3DDC84', fontSize: fs(11), fontWeight: 'bold' }}>
                      {asignado ? 'Desvincular ✗' : 'Asignar a ' + catSeleccionada + ' +'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 2: Plantel de Alumnos */}
        <View style={[styles.blockCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <View style={styles.blockHeader}>
            <Text style={[styles.blockTitle, { color: theme.textPrim, fontSize: fs(15) }]}>
              ⚽ Plantel de Jugadores ({alumnosDeCategoria.length})
            </Text>
          </View>

          <View style={{ gap: 8, marginTop: 8 }}>
            {alumnosDeCategoria.length === 0 ? (
              <Text style={{ color: theme.textMuted, fontSize: fs(12), fontStyle: 'italic', paddingVertical: 8 }}>
                No hay alumnos registrados en {catSeleccionada}.
              </Text>
            ) : (
              alumnosDeCategoria.map((alumno) => (
                <View key={alumno.id} style={[styles.itemRow, { borderColor: theme.border, backgroundColor: theme.bg }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.textPrim, fontSize: fs(13) }]}>{alumno.nombre_completo}</Text>
                    <Text style={[styles.itemSub, { color: theme.textMuted, fontSize: fs(10) }]}>
                      #{alumno.numero_camiseta || 10} · {alumno.posicion || 'Delantero'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.moveBtn, { borderColor: theme.accent }]}
                    onPress={() => setModalAlumno(alumno)}
                  >
                    <Text style={{ color: theme.accent, fontSize: fs(11), fontWeight: 'bold' }}>Reasignar Serie ⇄</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

      </View>

      {/* Modal Reasignar Serie de Alumno */}
      <Modal visible={!!modalAlumno} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>Reasignar Serie de Alumno</Text>
            <Text style={[styles.modalSub, { color: theme.textSec, fontSize: fs(12) }]}>
              Selecciona la nueva categoría para <Text style={{ fontWeight: 'bold', color: theme.accent }}>{modalAlumno?.nombre_completo}</Text>:
            </Text>

            <View style={{ gap: 8, marginVertical: 12 }}>
              {LISTA_CATEGORIAS.map((cat) => {
                const esActual = modalAlumno?.categoria === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    disabled={esActual}
                    style={[
                      styles.modalCatOption,
                      { backgroundColor: theme.bg, borderColor: theme.border },
                      esActual && { opacity: 0.5 }
                    ]}
                    onPress={() => moverAlumno(cat)}
                  >
                    <Text style={{ color: theme.textPrim, fontSize: fs(13), fontWeight: 'bold' }}>{cat}</Text>
                    {esActual && <Text style={{ color: theme.textMuted, fontSize: fs(11) }}>(Serie actual)</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => setModalAlumno(null)}>
              <Text style={{ color: theme.textSec, fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 4,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  inner: { padding: 20, gap: 16 },
  sectionTitle: { fontWeight: 'bold' },
  catCard: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1, minWidth: 90, alignItems: 'center' },
  catCardTitle: { fontWeight: 'bold' },
  catCardSub: { marginTop: 2 },
  blockCard: { padding: 14, borderRadius: 12, borderWidth: 1 },
  blockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blockTitle: { fontWeight: 'bold' },
  blockSub: { fontWeight: '500' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1 },
  itemName: { fontWeight: 'bold' },
  itemSub: { marginTop: 2 },
  assignBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  moveBtn: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalSub: { marginBottom: 6 },
  modalCatOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 10, borderWidth: 1 },
  modalCancel: { borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, marginTop: 8 },
});