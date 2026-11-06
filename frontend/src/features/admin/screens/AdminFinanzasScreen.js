import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { meses } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const CATEGORIAS = ['Todas', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];

export default function AdminFinanzasScreen({ navigation }) {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  const { alumnos, actualizarPago, actualizarMatricula, torneos, agregarTorneo, actualizarPagoTorneo } = useAlumnos();

  const [tabActual, setTabActual] = useState('mensualidades'); // 'mensualidades' | 'torneos'
  const [catFiltro, setCatFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // Modal para crear torneo
  const [modalTorneo, setModalTorneo] = useState(false);
  const [formTorneo, setFormTorneo] = useState({
    nombre: '',
    montoTotal: '30000',
    cuotas: '3',
    categorias: ['Sub-12'],
  });

  const alumnosFiltrados = alumnos.filter((a) => {
    const coincideCat = catFiltro === 'Todas' || a.categoria === catFiltro;
    const coincideNombre = a.nombre_completo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideNombre;
  });

  // Métricas de resumen
  const totalAlumnos = alumnos.length;
  const matriculasPagadas = alumnos.filter((a) => a.matricula).length;
  const alDiaCount = alumnos.filter((a) => {
    const pagosValores = Object.values(a.pagos);
    return a.matricula && pagosValores.length > 0 && pagosValores.every((p) => p === true);
  }).length;
  const morososCount = totalAlumnos - alDiaCount;

  const handleCrearTorneo = () => {
    if (!formTorneo.nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del torneo.');
      return;
    }
    agregarTorneo(formTorneo);
    setModalTorneo(false);
    setFormTorneo({ nombre: '', montoTotal: '30000', cuotas: '3', categorias: ['Sub-12'] });
    Alert.alert('Éxito', 'Torneo registrado correctamente.');
  };

  const toggleCatTorneo = (cat) => {
    setFormTorneo((prev) => {
      const existe = prev.categorias.includes(cat);
      if (existe) {
        if (prev.categorias.length === 1) return prev;
        return { ...prev, categorias: prev.categorias.filter((c) => c !== cat) };
      } else {
        return { ...prev, categorias: [...prev.categorias, cat] };
      }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Botón Volver con margen seguro para iOS */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface1 }]} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.textPrim }}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      <ScreenHeader title="Panel Financiero" subtitle="Control de cuotas, matrículas y torneos" />

      <View style={styles.inner}>

        {/* Tarjetas de Resumen General */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.metricVal, { color: theme.accent, fontSize: fs(20) }]}>{alDiaCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSec, fontSize: fs(10) }]}>Al día</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.metricVal, { color: '#FF5A5F', fontSize: fs(20) }]}>{morososCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSec, fontSize: fs(10) }]}>Con mora</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.metricVal, { color: theme.textPrim, fontSize: fs(20) }]}>{matriculasPagadas}/{totalAlumnos}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSec, fontSize: fs(10) }]}>Matrículas</Text>
          </View>
        </View>

        {/* Selector de Pestañas: Mensualidades vs Torneos */}
        <View style={[styles.tabNav, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.tabBtn, tabActual === 'mensualidades' && { backgroundColor: theme.accentDark }]}
            onPress={() => setTabActual('mensualidades')}
          >
            <Text style={[styles.tabText, { color: tabActual === 'mensualidades' ? '#fff' : theme.textSec, fontSize: fs(12) }]}>
              💵 Mensualidades
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tabActual === 'torneos' && { backgroundColor: theme.accentDark }]}
            onPress={() => setTabActual('torneos')}
          >
            <Text style={[styles.tabText, { color: tabActual === 'torneos' ? '#fff' : theme.textSec, fontSize: fs(12) }]}>
              🏆 Cobro de Torneos
            </Text>
          </TouchableOpacity>
        </View>

        {/* PESTAÑA 1: MENSUALIDADES Y MATRÍCULAS */}
        {tabActual === 'mensualidades' && (
          <View style={{ gap: 14 }}>
            {/* Buscador */}
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface1, color: theme.textPrim, borderColor: theme.border }]}
              placeholder="Buscar alumno..."
              placeholderTextColor={theme.textMuted}
              value={busqueda}
              onChangeText={setBusqueda}
            />

            {/* Filtro por Categorías */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, { backgroundColor: theme.surface1, borderColor: theme.border }, catFiltro === cat && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                  onPress={() => setCatFiltro(cat)}
                >
                  <Text style={{ color: catFiltro === cat ? '#fff' : theme.textSec, fontSize: fs(11), fontWeight: 'bold' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Listado de Alumnos con Grilla Financiera */}
            <View style={{ gap: 12 }}>
              {alumnosFiltrados.map((item) => (
                <View key={item.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.studentName, { color: theme.textPrim, fontSize: fs(14) }]}>{item.nombre_completo}</Text>
                      <Text style={[styles.studentSub, { color: theme.textSec, fontSize: fs(11) }]}>{item.categoria}</Text>
                    </View>

                    {/* Badge Matrícula (Clickeable) */}
                    <TouchableOpacity
                      style={[styles.matBadge, { backgroundColor: item.matricula ? 'rgba(61,220,132,0.15)' : 'rgba(255,90,95,0.15)' }]}
                      onPress={() => actualizarMatricula(item.id)}
                    >
                      <Text style={{ color: item.matricula ? '#3DDC84' : '#FF5A5F', fontSize: fs(11), fontWeight: 'bold' }}>
                        Matrícula {item.matricula ? '✓' : '✗'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Grilla Mensual (Marzo a Septiembre) */}
                  <Text style={[styles.gridTitle, { color: theme.textMuted, fontSize: fs(10) }]}>Mensualidades 2026:</Text>
                  <View style={styles.monthsGrid}>
                    {Object.entries(meses).map(([num, nombre]) => {
                      const st = item.pagos[num];
                      let bg = theme.surface2;
                      let color = theme.textMuted;
                      let sim = '–';

                      if (st === true) { bg = 'rgba(61,220,132,0.15)'; color = '#3DDC84'; sim = '✓'; }
                      else if (st === false) { bg = 'rgba(255,90,95,0.15)'; color = '#FF5A5F'; sim = '✗'; }
                      else if (st === 'na') { bg = theme.surface2; color = theme.textMuted; sim = 'N/A'; }

                      return (
                        <TouchableOpacity
                          key={num}
                          style={[styles.monthBox, { backgroundColor: bg }]}
                          onPress={() => actualizarPago(item.id, parseInt(num))}
                        >
                          <Text style={[styles.monthLabel, { color, fontSize: fs(9) }]}>{nombre}</Text>
                          <Text style={[styles.monthSim, { color, fontSize: fs(11) }]}>{sim}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* PESTAÑA 2: COBRO DE TORNEOS EN CUOTAS */}
        {tabActual === 'torneos' && (
          <View style={{ gap: 14 }}>
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalTorneo(true)}>
              <Text style={[styles.addBtnText, { fontSize: fs(14) }]}>+ Configurar Nuevo Torneo</Text>
            </TouchableOpacity>

            <View style={{ gap: 16 }}>
              {torneos.map((torneo) => (
                <View key={torneo.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.studentName, { color: theme.textPrim, fontSize: fs(15) }]}>{torneo.nombre}</Text>
                      <Text style={[styles.studentSub, { color: theme.textSec, fontSize: fs(11) }]}>
                        Categorías: {torneo.categorias.join(', ')} · Total: ${torneo.montoTotal.toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.matBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                      <Text style={{ color: theme.accent, fontSize: fs(11), fontWeight: 'bold' }}>
                        {torneo.cuotas} cuotas de ${torneo.valorCuota.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.gridTitle, { color: theme.textMuted, fontSize: fs(10), marginTop: 8 }]}>
                    Estado de cuotas por alumno:
                  </Text>

                  {/* Lista de Alumnos habilitados para este Torneo */}
                  <View style={{ gap: 8, marginTop: 4 }}>
                    {alumnos
                      .filter((a) => torneo.categorias.includes(a.categoria))
                      .map((alu) => {
                        const pagosAlu = torneo.pagosAlumnos[alu.id] || {};

                        return (
                          <View key={alu.id} style={[styles.torneoAluRow, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.torneoAluName, { color: theme.textPrim, fontSize: fs(12) }]}>{alu.nombre_completo}</Text>
                              <Text style={[styles.studentSub, { color: theme.textMuted, fontSize: fs(10) }]}>{alu.categoria}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 6 }}>
                              {Array.from({ length: torneo.cuotas }, (_, i) => i + 1).map((cuotaNum) => {
                                const pagado = pagosAlu[cuotaNum];
                                let bg = theme.surface2;
                                let color = theme.textMuted;
                                let texto = `C${cuotaNum}: –`;

                                if (pagado === true) { bg = 'rgba(61,220,132,0.15)'; color = '#3DDC84'; texto = `C${cuotaNum} ✓`; }
                                else if (pagado === false) { bg = 'rgba(255,90,95,0.15)'; color = '#FF5A5F'; texto = `C${cuotaNum} ✗`; }

                                return (
                                  <TouchableOpacity
                                    key={cuotaNum}
                                    style={[styles.cuotaBtn, { backgroundColor: bg }]}
                                    onPress={() => actualizarPagoTorneo(torneo.id, alu.id, cuotaNum)}
                                  >
                                    <Text style={{ color, fontSize: fs(10), fontWeight: 'bold' }}>{texto}</Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        );
                      })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

      </View>

      {/* Modal Crear Torneo */}
      <Modal visible={modalTorneo} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>Configurar Nuevo Torneo</Text>

            <Text style={[styles.label, { color: theme.textSec }]}>Nombre del Torneo / Evento</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
              value={formTorneo.nombre}
              onChangeText={(t) => setFormTorneo((p) => ({ ...p, nombre: t }))}
              placeholder="Ej: Copa Infantil Clausura 2026"
              placeholderTextColor={theme.textMuted}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.textSec }]}>Monto Total ($)</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                  value={formTorneo.montoTotal}
                  onChangeText={(t) => setFormTorneo((p) => ({ ...p, montoTotal: t }))}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.textSec }]}>N° de Cuotas</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                  value={formTorneo.cuotas}
                  onChangeText={(t) => setFormTorneo((p) => ({ ...p, cuotas: t }))}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.textSec }]}>Categorías Participantes</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'].map((cat) => {
                const checked = formTorneo.categorias.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border }, checked && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                    onPress={() => toggleCatTorneo(cat)}
                  >
                    <Text style={{ color: checked ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => setModalTorneo(false)}>
                <Text style={{ color: theme.textSec }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleCrearTorneo}>
                <Text style={styles.modalSaveText}>Guardar Torneo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  metricVal: { fontWeight: 'bold' },
  metricLabel: { marginTop: 2 },
  tabNav: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabText: { fontWeight: 'bold' },
  input: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentName: { fontWeight: 'bold' },
  studentSub: { marginTop: 2 },
  matBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  gridTitle: { fontWeight: 'bold' },
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  monthBox: { width: '13%', aspectRatio: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center', minWidth: 38 },
  monthLabel: { fontWeight: 'bold' },
  monthSim: { fontWeight: 'bold' },
  addBtn: { backgroundColor: '#3DDC84', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  addBtnText: { color: '#0B0F14', fontWeight: 'bold' },
  torneoAluRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 8, borderWidth: 1 },
  torneoAluName: { fontWeight: '500' },
  cuotaBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, minWidth: 42, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  label: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  modalInput: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 14 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 12, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontWeight: 'bold' },
});