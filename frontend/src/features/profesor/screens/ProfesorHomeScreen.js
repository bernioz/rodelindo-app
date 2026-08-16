import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import ScreenHeader from '../../../components/ScreenHeader';

const TIPOS = ['Clase', 'Torneo', 'Reunión', 'Otro'];

const HOY = new Date();
const formatFecha = (d) => d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

const esHoy = (fechaStr) => {
  try {
    const partes = fechaStr.split(' ');
    if (partes.length < 2) return false;
    const mesesMap = {
      ene:0,feb:1,mar:2,abr:3,may:4,jun:5,
      jul:6,ago:7,sep:8,oct:9,nov:10,dic:11
    };
    const mes = mesesMap[partes[1].toLowerCase()];
    const dia = parseInt(partes[0]);
    const d = new Date(HOY.getFullYear(), mes, dia);
    return d.toDateString() === HOY.toDateString();
  } catch { return false; }
};

const tagColor = (tag) => ({
  'Clase':   { bg: 'rgba(61,220,132,0.1)',  text: '#3DDC84' },
  'Torneo':  { bg: 'rgba(66,133,244,0.1)',  text: '#4285F4' },
  'Reunión': { bg: 'rgba(245,166,35,0.1)',  text: '#F5A623' },
  'Otro':    { bg: 'rgba(138,147,163,0.1)', text: '#8A93A3' },
}[tag] ?? { bg: 'rgba(138,147,163,0.1)', text: '#8A93A3' });

const EVENTOS_INICIALES = [
  { id: 1, fecha: formatFecha(HOY), titulo: 'Entrenamiento Sub-12', sub: 'Cancha principal · 16:00', tag: 'Clase' },
  { id: 2, fecha: formatFecha(HOY), titulo: 'Entrenamiento Sub-8',  sub: 'Cancha auxiliar · 18:00', tag: 'Clase' },
  { id: 3, fecha: '12 ago', titulo: 'Copa Regional Infantil', sub: 'Estadio municipal · 10:00', tag: 'Torneo' },
  { id: 4, fecha: '15 ago', titulo: 'Reunión apoderados Sub-14', sub: 'Sala de reuniones · 19:00', tag: 'Reunión' },
];

export default function ProfesorHomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();          // ← dentro del componente
  const navigation = useNavigation();

  const [eventos, setEventos] = useState(EVENTOS_INICIALES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [draft, setDraft] = useState({ fecha: '', titulo: '', sub: '', tag: 'Clase' });

  const eventosHoy = eventos.filter((e) => esHoy(e.fecha));
  const proximos   = eventos.filter((e) => !esHoy(e.fecha));

  const abrirNuevo = () => {
    setEditando(null);
    setDraft({ fecha: '', titulo: '', sub: '', tag: 'Clase' });
    setModalVisible(true);
  };

  const abrirEditar = (ev) => {
    setEditando(ev);
    setDraft({ fecha: ev.fecha, titulo: ev.titulo, sub: ev.sub, tag: ev.tag });
    setModalVisible(true);
  };

  const guardar = () => {
    if (!draft.titulo.trim() || !draft.fecha.trim()) return;
    if (editando) {
      setEventos((prev) => prev.map((e) => e.id === editando.id ? { ...e, ...draft } : e));
    } else {
      setEventos((prev) => [...prev, { ...draft, id: Date.now() }]);
    }
    setModalVisible(false);
  };

  const eliminar = (id) => setEventos((prev) => prev.filter((e) => e.id !== id));

  const EventoRow = ({ ev }) => {
    const c = tagColor(ev.tag);
    return (
      <TouchableOpacity
        style={[styles.eventRow, { backgroundColor: theme.surface1 }]}
        onPress={() => abrirEditar(ev)} activeOpacity={0.8}>
        <View style={[styles.eventDate,
          { backgroundColor: esHoy(ev.fecha) ? theme.accent : theme.accentDark }]}>
          <Text style={styles.eventDateText}>{ev.fecha}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: theme.textPrim }]}>{ev.titulo}</Text>
          <Text style={[styles.eventSub, { color: theme.textSec }]}>{ev.sub}</Text>
        </View>
        <View style={styles.eventRight}>
          <View style={[styles.tag, { backgroundColor: c.bg }]}>
            <Text style={[styles.tagText, { color: c.text }]}>{ev.tag}</Text>
          </View>
          <TouchableOpacity onPress={() => eliminar(ev.id)} style={styles.deleteBtn}>
            <Text style={[styles.deleteText, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.content}>

        <ScreenHeader title={`Hola, ${user.nombre} 👋`} subtitle="Panel del Profesor" />

        <View style={styles.inner}>
          {/* Acciones rápidas */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={() => navigation.navigate('AlumnosTab')}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={[styles.actionLabel, { color: theme.textPrim }]}>Ver Alumnos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={() => navigation.navigate('AsistenciaTab')}>
              <Text style={styles.actionIcon}>✅</Text>
              <Text style={[styles.actionLabel, { color: theme.textPrim }]}>Asistencia</Text>
            </TouchableOpacity>
          </View>

          {/* Hoy */}
          {eventosHoy.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrim }]}>📅 Hoy</Text>
                <TouchableOpacity onPress={abrirNuevo}>
                  <Text style={[styles.addLink, { color: theme.accent }]}>+ Agregar</Text>
                </TouchableOpacity>
              </View>
              {eventosHoy.map((ev) => <EventoRow key={ev.id} ev={ev} />)}
            </>
          )}

          {/* Próximos */}
          <View style={[styles.sectionHeader, { marginTop: eventosHoy.length > 0 ? 20 : 0 }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrim }]}>Próximos eventos</Text>
            <TouchableOpacity onPress={abrirNuevo}>
              <Text style={[styles.addLink, { color: theme.accent }]}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {proximos.length === 0 && eventosHoy.length === 0 && (
            <TouchableOpacity style={[styles.emptyCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={abrirNuevo}>
              <Text style={styles.emptyIcon}>📆</Text>
              <Text style={[styles.emptyText, { color: theme.textSec }]}>No hay eventos planificados</Text>
              <Text style={[styles.emptyLink, { color: theme.accent }]}>Toca para agregar uno</Text>
            </TouchableOpacity>
          )}

          {proximos.map((ev) => <EventoRow key={ev.id} ev={ev} />)}

          <View style={[styles.tip, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <Text style={[styles.tipText, { color: theme.textMuted }]}>
              💡 Toca un evento para editarlo · Los de hoy se destacan en verde
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>
              {editando ? 'Editar evento' : 'Nuevo evento'}
            </Text>

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Título *</Text>
            <TextInput style={[styles.modalInput, { backgroundColor: theme.bg,
              color: theme.textPrim, borderColor: theme.border }]}
              value={draft.titulo}
              onChangeText={(t) => setDraft((p) => ({ ...p, titulo: t }))}
              placeholder="Ej: Entrenamiento Sub-12"
              placeholderTextColor={theme.textMuted} />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Fecha * (Ej: 20 ago)</Text>
            <TextInput style={[styles.modalInput, { backgroundColor: theme.bg,
              color: theme.textPrim, borderColor: theme.border }]}
              value={draft.fecha}
              onChangeText={(t) => setDraft((p) => ({ ...p, fecha: t }))}
              placeholder="Ej: 20 ago"
              placeholderTextColor={theme.textMuted} />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Lugar · Hora</Text>
            <TextInput style={[styles.modalInput, { backgroundColor: theme.bg,
              color: theme.textPrim, borderColor: theme.border }]}
              value={draft.sub}
              onChangeText={(t) => setDraft((p) => ({ ...p, sub: t }))}
              placeholder="Ej: Cancha principal · 16:00"
              placeholderTextColor={theme.textMuted} />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Tipo</Text>
            <View style={styles.tiposRow}>
              {TIPOS.map((tipo) => (
                <TouchableOpacity key={tipo}
                  style={[styles.tipoBtn, { backgroundColor: theme.bg, borderColor: theme.border },
                    draft.tag === tipo && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}
                  onPress={() => setDraft((p) => ({ ...p, tag: tipo }))}>
                  <Text style={[styles.tipoBtnText,
                    { color: draft.tag === tipo ? '#fff' : theme.textSec }]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel,
                { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalCancelText, { color: theme.textSec }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={guardar}>
                <Text style={styles.modalSaveText}>
                  {editando ? 'Guardar cambios' : 'Agregar'}
                </Text>
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
  actionsGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  actionCard: {
    flex: 1, borderRadius: 12, padding: 16,
    alignItems: 'center', gap: 8, borderWidth: 1,
  },
  actionIcon: { fontSize: 26 },
  actionLabel: { fontSize: 13, fontWeight: 'bold' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  addLink: { fontSize: 13 },
  eventRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 12, marginBottom: 8, gap: 12 },
  eventDate: { borderRadius: 8, minWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  eventDateText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 13, fontWeight: '500' },
  eventSub: { fontSize: 11, marginTop: 2 },
  eventRight: { alignItems: 'flex-end', gap: 6 },
  tag: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  tagText: { fontSize: 11, fontWeight: 'bold' },
  deleteBtn: { padding: 2 },
  deleteText: { fontSize: 12 },
  emptyCard: {
    borderRadius: 12, padding: 28, alignItems: 'center',
    gap: 6, borderWidth: 1, borderStyle: 'dashed',
  },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontSize: 14 },
  emptyLink: { fontSize: 13 },
  tip: { marginTop: 20, borderRadius: 10, padding: 12, borderWidth: 1 },
  tipText: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 44 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalLabel: { fontSize: 12, marginBottom: 6, marginTop: 12 },
  modalInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  tiposRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  tipoBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  tipoBtnText: { fontSize: 13 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  modalCancelText: { fontSize: 15 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontSize: 15, fontWeight: 'bold' },
});
