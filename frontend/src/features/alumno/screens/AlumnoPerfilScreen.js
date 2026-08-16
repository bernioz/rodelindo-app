import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { meses, getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const MES_ACTUAL = new Date().getMonth() + 1;
const FONT_SIZES = [
  { label: 'Pequeño', value: 0.85 },
  { label: 'Normal',  value: 1.0  },
  { label: 'Grande',  value: 1.2  },
];

export default function AlumnoPerfilScreen() {
  const { user, logout } = useAuth();
  const { theme, mode, toggleMode, fontSize, setFontSize } = useTheme();
  const { alumnos } = useAlumnos();

  const alumno = alumnos.find((a) => a.id === user.alumnoId);

  const [modalConfig, setModalConfig] = useState(false);
  const [config, setConfig] = useState({
    nombreApoderado: 'Carlos González',
    telefono: '+56 9 1234 5678',
    email: 'carlos.gonzalez@gmail.com',
  });
  const [configDraft, setConfigDraft] = useState(config);

  if (!alumno) return null;

  const fs = (s) => s * fontSize;
  const mesesPagados = Object.values(alumno.pagos).filter(Boolean).length;

  const colorPct = (pct) => {
    if (pct >= 80) return theme.accent;
    if (pct >= 60) return '#F5A623';
    return '#FF5A5F';
  };

  const mesEstilos = (num) => {
    const pagado = alumno.pagos[num];
    const futuro = num > MES_ACTUAL;
    if (pagado === true)  return { bg: 'rgba(61,220,132,0.15)', color: '#3DDC84', simbolo: '✓' };
    if (pagado === false) return { bg: 'rgba(255,90,95,0.15)',  color: '#FF5A5F', simbolo: '✗' };
    if (futuro)           return { bg: theme.surface2, color: theme.textMuted, simbolo: '–' };
    return { bg: 'rgba(255,90,95,0.15)', color: '#FF5A5F', simbolo: '✗' };
  };

  const guardarConfig = () => { setConfig(configDraft); setModalConfig(false); };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.content}>

        <ScreenHeader title="Mi Perfil" subtitle="FC Rodelindo Román" />

        <View style={styles.inner}>

          {/* Avatar */}
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
              <Text style={[styles.avatarText, { fontSize: fs(26) }]}>
                {getIniciales(alumno.nombre_completo)}
              </Text>
            </View>
            <Text style={[styles.nombre, { color: theme.textPrim, fontSize: fs(22) }]}>
              {alumno.nombre_completo}
            </Text>
            <View style={[styles.catBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
              <Text style={[styles.catBadgeText, { color: theme.accent, fontSize: fs(12) }]}>
                {alumno.categoria}
              </Text>
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
                <Text style={[styles.statVal, { color: s.color, fontSize: fs(22) }]}>{s.val}</Text>
                <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(10) }]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Pagos — solo lectura */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Estado de pagos 2025
          </Text>
          <View style={[styles.pagosCard, { backgroundColor: theme.surface1 }]}>
            <View style={styles.matriculaRow}>
              <Text style={[styles.pagosLabel, { color: theme.textPrim, fontSize: fs(14) }]}>
                Matrícula
              </Text>
              <View style={[styles.estadoBadge,
                alumno.matricula ? styles.badgePagado : styles.badgePendiente]}>
                <Text style={[styles.estadoBadgeText,
                  alumno.matricula ? styles.badgeTextPagado : styles.badgeTextPendiente,
                  { fontSize: fs(12) }]}>
                  {alumno.matricula ? 'Pagada ✓' : 'Pendiente ✗'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.mesesGrid}>
              {Object.entries(meses).map(([num, nombre]) => {
                const { bg, color, simbolo } = mesEstilos(parseInt(num));
                return (
                  <View key={num} style={[styles.mesCard, { backgroundColor: bg }]}>
                    <Text style={[styles.mesNombre, { color, fontSize: fs(9) }]}>{nombre}</Text>
                    <Text style={[styles.mesEstado, { color, fontSize: fs(12) }]}>{simbolo}</Text>
                  </View>
                );
              })}
            </View>

            <View style={[styles.leyenda, { marginTop: 12 }]}>
              {[
                { color: 'rgba(61,220,132,0.3)', label: 'Pagado' },
                { color: 'rgba(255,90,95,0.3)',  label: 'Pendiente' },
                { color: theme.surface2,          label: 'Próximo' },
              ].map((l) => (
                <View key={l.label} style={styles.leyendaItem}>
                  <View style={[styles.leyendaDot, { backgroundColor: l.color }]} />
                  <Text style={[styles.leyendaText, { color: theme.textSec, fontSize: fs(10) }]}>
                    {l.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Datos del apoderado — editables */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
              Datos del apoderado
            </Text>
            <TouchableOpacity onPress={() => { setConfigDraft(config); setModalConfig(true); }}>
              <Text style={[styles.editLink, { color: theme.accent, fontSize: fs(13) }]}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
            {[
              { k: 'Apoderado', v: config.nombreApoderado },
              { k: 'Teléfono',  v: config.telefono },
              { k: 'Email',     v: config.email },
            ].map(({ k, v }) => (
              <View key={k} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoKey, { color: theme.textSec, fontSize: fs(13) }]}>{k}</Text>
                <Text style={[styles.infoVal, { color: theme.textPrim, fontSize: fs(13) }]}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Info del alumno — solo lectura */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Información
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
            {[
              { k: 'Nombre',      v: alumno.nombre_completo },
              { k: 'Categoría',   v: alumno.categoria },
              { k: 'Institución', v: 'FC Rodelindo Román' },
              { k: 'Ciudad',      v: 'Concepción' },
            ].map(({ k, v }) => (
              <View key={k} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoKey, { color: theme.textSec, fontSize: fs(13) }]}>{k}</Text>
                <Text style={[styles.infoVal, { color: theme.textPrim, fontSize: fs(13) }]}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Accesibilidad */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Accesibilidad
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
            <View style={[styles.accessRow, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.accessLabel, { color: theme.textPrim, fontSize: fs(14) }]}>
                  Fondo claro
                </Text>
                <Text style={[styles.accessSub, { color: theme.textSec, fontSize: fs(11) }]}>
                  Cambia entre tema oscuro y claro
                </Text>
              </View>
              <Switch
                value={mode === 'light'}
                onValueChange={toggleMode}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.accessRow}>
              <Text style={[styles.accessLabel, { color: theme.textPrim, fontSize: fs(14) }]}>
                Tamaño de letra
              </Text>
            </View>
            <View style={styles.fontSizeRow}>
              {FONT_SIZES.map((f) => (
                <TouchableOpacity key={f.label}
                  style={[styles.fontBtn, { backgroundColor: theme.bg, borderColor: theme.border },
                    fontSize === f.value && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}
                  onPress={() => setFontSize(f.value)}>
                  <Text style={[styles.fontBtnText,
                    { color: fontSize === f.value ? '#fff' : theme.textSec, fontSize: f.value * 13 }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cerrar sesión */}
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: theme.surface1, borderColor: '#FF5A5F' }]}
            onPress={logout}>
            <Text style={[styles.logoutText, { fontSize: fs(15) }]}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal editar apoderado */}
      <Modal visible={modalConfig} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>Datos del apoderado</Text>
            {[
              { label: 'Nombre apoderado', key: 'nombreApoderado', keyboard: 'default' },
              { label: 'Teléfono',         key: 'telefono',        keyboard: 'phone-pad' },
              { label: 'Email',            key: 'email',           keyboard: 'email-address' },
            ].map(({ label, key, keyboard }) => (
              <View key={key}>
                <Text style={[styles.modalLabel, { color: theme.textSec }]}>{label}</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.bg,
                    color: theme.textPrim, borderColor: theme.border }]}
                  value={configDraft[key]}
                  onChangeText={(t) => setConfigDraft((p) => ({ ...p, [key]: t }))}
                  keyboardType={keyboard}
                  autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            ))}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel,
                { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => setModalConfig(false)}>
                <Text style={[styles.modalCancelText, { color: theme.textSec }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={guardarConfig}>
                <Text style={styles.modalSaveText}>Guardar</Text>
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
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  nombre: { fontWeight: 'bold', textAlign: 'center' },
  catBadge: { marginTop: 8, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 },
  catBadgeText: { fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontWeight: 'bold' },
  statLabel: { textAlign: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editLink: {},
  pagosCard: { borderRadius: 12, padding: 16, marginBottom: 20 },
  matriculaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  pagosLabel: { fontWeight: '500' },
  estadoBadge: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12 },
  badgePagado: { backgroundColor: 'rgba(61,220,132,0.15)' },
  badgePendiente: { backgroundColor: 'rgba(255,90,95,0.15)' },
  estadoBadgeText: { fontWeight: 'bold' },
  badgeTextPagado: { color: '#3DDC84' },
  badgeTextPendiente: { color: '#FF5A5F' },
  divider: { height: 1, marginBottom: 14 },
  mesesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mesCard: { width: '13%', aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 40 },
  mesNombre: { fontWeight: 'bold' },
  mesEstado: { fontWeight: 'bold' },
  leyenda: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  leyendaDot: { width: 8, height: 8, borderRadius: 2 },
  leyendaText: {},
  infoCard: { borderRadius: 12, padding: 16, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1 },
  infoKey: {},
  infoVal: { fontWeight: '500' },
  accessRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  accessLabel: { fontWeight: '500' },
  accessSub: { marginTop: 2 },
  fontSizeRow: { flexDirection: 'row', gap: 10, paddingVertical: 12 },
  fontBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  fontBtnText: { fontWeight: '500' },
  logoutBtn: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  logoutText: { color: '#FF5A5F', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 44 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalLabel: { fontSize: 12, marginBottom: 6, marginTop: 12 },
  modalInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  modalCancelText: { fontSize: 15 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontSize: 15, fontWeight: 'bold' },
});
