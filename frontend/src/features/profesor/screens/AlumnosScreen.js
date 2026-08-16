import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Modal, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { meses, getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const CATS = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];

// Mes actual (1-12)
const MES_ACTUAL = new Date().getMonth() + 1;

// Meses del año que ya pasaron o son el actual, de los que están en el objeto meses
const mesesTranscurridos = Object.keys(meses)
  .map(Number)
  .filter((m) => m <= MES_ACTUAL);

// Matrícula automática: true si todos los meses transcurridos están pagados
const calcularMatricula = (pagos) => {
  if (mesesTranscurridos.length === 0) return false;
  return mesesTranscurridos.every((m) => pagos[m] === true);
};

export default function AlumnosScreen({ navigation }) {
  const { theme, fontSize } = useTheme();
  const { getByCategoria, agregarAlumno } = useAlumnos();
  const [categoriaActiva, setCategoriaActiva] = useState('Sub-12');
  const alumnos = getByCategoria(categoriaActiva);

  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState({ nombre_completo: '', categoria: 'Sub-12' });

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const guardarAlumno = () => {
    if (!draft.nombre_completo.trim()) return;
    agregarAlumno({ ...draft, matricula: false });
    setCategoriaActiva(draft.categoria);
    setDraft({ nombre_completo: '', categoria: 'Sub-12' });
    setModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Alumnos" subtitle={`${alumnos.length} en ${categoriaActiva}`} />

      {/* Tabs — altura fija para que no se compriman */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {CATS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tab,
                { backgroundColor: theme.surface1, borderColor: theme.border },
                categoriaActiva === cat && { backgroundColor: theme.accentDark, borderColor: theme.accentDark },
              ]}
              onPress={() => setCategoriaActiva(cat)}
            >
              <Text style={[
                styles.tabText,
                { color: theme.textSec, fontSize: 13 * fontSize },
                categoriaActiva === cat && { color: '#fff', fontWeight: 'bold' },
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Botón agregar */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.accentDark }]}
        onPress={() => setModal(true)}
      >
        <Text style={styles.addBtnText}>+ Agregar alumno</Text>
      </TouchableOpacity>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No hay alumnos en {categoriaActiva}.{'\n'}Toca "+ Agregar alumno" para añadir uno.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const matriculaAuto = calcularMatricula(item.pagos);
          return (
            <TouchableOpacity
              style={[styles.alumnoCard, { backgroundColor: theme.surface1 }]}
              onPress={() => navigation.navigate('PerfilAlumno', { alumnoId: item.id })}
              activeOpacity={0.75}
            >
              <View style={styles.alumnoTop}>
                <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
                  <Text style={styles.avatarText}>{getIniciales(item.nombre_completo)}</Text>
                </View>
                <View style={styles.alumnoInfo}>
                  <Text style={[styles.alumnoNombre, { color: theme.textPrim, fontSize: 15 * fontSize }]}>
                    {item.nombre_completo}
                  </Text>
                  <Text style={[styles.alumnoCategoria, { color: theme.textSec, fontSize: 12 * fontSize }]}>
                    {item.categoria}
                  </Text>
                </View>
                <View style={styles.pctContainer}>
                  <Text style={[styles.pct, { color: colorPct(item.asistencia), fontSize: 18 * fontSize }]}>
                    {item.asistencia}%
                  </Text>
                  <Text style={[styles.pctLabel, { color: theme.textMuted }]}>asist.</Text>
                </View>
              </View>

              {/* Chips de pagos */}
              <View style={styles.pagosRow}>
                {/* Matrícula automática */}
                <View style={[styles.matriculaChip,
                  matriculaAuto ? styles.chipPagado : styles.chipPendiente]}>
                  <Text style={[styles.chipText,
                    matriculaAuto ? styles.chipTextPagado : styles.chipTextPendiente]}>
                    {matriculaAuto ? 'Al día ✓' : 'Debe cuotas'}
                  </Text>
                </View>

                {/* Meses */}
                {Object.entries(meses).map(([num, nombre]) => {
                  const numInt = parseInt(num);
                  const pagado = item.pagos[numInt];
                  const esFuturo = numInt > MES_ACTUAL;
                  return (
                    <View
                      key={num}
                      style={[
                        styles.mesChip,
                        pagado === true  ? styles.chipPagado :
                        pagado === false ? styles.chipPendiente :
                        esFuturo ? { backgroundColor: theme.surface2 } :
                        styles.chipPendiente,
                      ]}
                    >
                      <Text style={[
                        styles.chipText,
                        pagado === true  ? styles.chipTextPagado :
                        pagado === false ? styles.chipTextPendiente :
                        esFuturo ? { color: theme.textMuted } :
                        styles.chipTextPendiente,
                      ]}>
                        {nombre}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal nuevo alumno */}
      <Modal visible={modal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>Nuevo alumno</Text>

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Nombre completo *</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg,
                color: theme.textPrim, borderColor: theme.border }]}
              value={draft.nombre_completo}
              onChangeText={(t) => setDraft((p) => ({ ...p, nombre_completo: t }))}
              placeholder="Ej: Juan Pérez González"
              placeholderTextColor={theme.textMuted}
            />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Categoría</Text>
            <View style={styles.catsRow}>
              {CATS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catBtn,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                    draft.categoria === cat && { backgroundColor: theme.accentDark, borderColor: theme.accentDark },
                  ]}
                  onPress={() => setDraft((p) => ({ ...p, categoria: cat }))}
                >
                  <Text style={[
                    styles.catBtnText,
                    { color: theme.textSec },
                    draft.categoria === cat && { color: '#fff', fontWeight: 'bold' },
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => setModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: theme.textSec }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={guardarAlumno}>
                <Text style={styles.modalSaveText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Wrapper con altura fija evita que FlatList comprima los tabs
  tabsWrapper: {
    height: 52,
    flexShrink: 0,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  tabText: {},
  addBtn: {
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  lista: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyText: { textAlign: 'center', lineHeight: 22 },
  alumnoCard: { borderRadius: 12, padding: 12, marginBottom: 12, gap: 10 },
  alumnoTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  alumnoInfo: { flex: 1 },
  alumnoNombre: { fontWeight: '500' },
  alumnoCategoria: { marginTop: 2 },
  pctContainer: { alignItems: 'center' },
  pct: { fontWeight: 'bold' },
  pctLabel: { fontSize: 10 },
  pagosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  matriculaChip: { borderRadius: 5, paddingVertical: 3, paddingHorizontal: 7 },
  mesChip: { borderRadius: 5, paddingVertical: 3, paddingHorizontal: 6 },
  chipText: { fontSize: 10, fontWeight: '600' },
  chipPagado: { backgroundColor: 'rgba(61,220,132,0.15)' },
  chipPendiente: { backgroundColor: 'rgba(255,90,95,0.15)' },
  chipTextPagado: { color: '#3DDC84' },
  chipTextPendiente: { color: '#FF5A5F' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 44 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalLabel: { fontSize: 12, marginBottom: 8, marginTop: 14 },
  modalInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  catsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  catBtnText: { fontSize: 13 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  modalCancelText: { fontSize: 15 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontSize: 15, fontWeight: 'bold' },
});
