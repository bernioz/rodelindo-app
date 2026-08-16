import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { categorias } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const FONT_SIZES = [
  { label: 'Pequeño', value: 0.85 },
  { label: 'Normal',  value: 1.0  },
  { label: 'Grande',  value: 1.2  },
];

export default function PerfilProfesorScreen() {
  const { user, logout } = useAuth();
  const { theme, mode, toggleMode, fontSize, setFontSize } = useTheme();
  const { getByCategoria } = useAlumnos();

  const totalAlumnos = categorias.reduce((acc, cat) => acc + getByCategoria(cat).length, 0);

  // Estado configuración
  const [modalConfig, setModalConfig] = useState(false);
  const [config, setConfig] = useState({
    nombre: user.nombre,
    email: 'rodrigo.vera@rodelindo.cl',
    telefono: '+56 9 8765 4321',
    institucion: 'FC Rodelindo Román',
    ciudad: 'Concepción',
  });
  const [configDraft, setConfigDraft] = useState(config);

  const guardarConfig = () => { setConfig(configDraft); setModalConfig(false); };

  const fs = (size) => size * fontSize;

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.content}>

        <ScreenHeader title="Mi Perfil" subtitle="FC Rodelindo Román" />

        <View style={styles.inner}>

          {/* Avatar */}
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
              <Text style={styles.avatarText}>
                {user.nombre.split(' ').slice(0,2).map((n) => n[0]).join('')}
              </Text>
            </View>
            <Text style={[styles.nombre, { color: theme.textPrim, fontSize: fs(22) }]}>
              {config.nombre}
            </Text>
            <Text style={[styles.rol, { color: theme.textSec, fontSize: fs(13) }]}>
              Profesor · {config.institucion}
            </Text>
            <View style={[styles.rolBadge, { backgroundColor: 'rgba(61,220,132,0.1)' }]}>
              <Text style={[styles.rolBadgeText, { color: theme.accent }]}>Profesor</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { val: categorias.length, label: 'Categorías' },
              { val: totalAlumnos,      label: 'Alumnos' },
              { val: 2,                 label: 'Torneos' },
            ].map((s) => (
              <View key={s.label} style={[styles.statCard, { backgroundColor: theme.surface1 }]}>
                <Text style={[styles.statVal, { color: theme.accent, fontSize: fs(24) }]}>{s.val}</Text>
                <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(11) }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Categorías */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Categorías a cargo
          </Text>
          {categorias.map((cat) => (
            <View key={cat} style={[styles.catRow, { backgroundColor: theme.surface1 }]}>
              <View style={[styles.catBadge, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                <Text style={[styles.catBadgeText, { color: theme.accent }]}>{cat}</Text>
              </View>
              <Text style={[styles.catAlumnos, { color: theme.textSec, fontSize: fs(13) }]}>
                {getByCategoria(cat).length} alumnos
              </Text>
            </View>
          ))}

          {/* ── CONFIGURACIÓN ── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
              Configuración
            </Text>
            <TouchableOpacity onPress={() => { setConfigDraft(config); setModalConfig(true); }}>
              <Text style={[styles.editLink, { color: theme.accent }]}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
            {[
              { k: 'Nombre',      v: config.nombre },
              { k: 'Email',       v: config.email },
              { k: 'Teléfono',    v: config.telefono },
              { k: 'Institución', v: config.institucion },
              { k: 'Ciudad',      v: config.ciudad },
            ].map(({ k, v }) => (
              <View key={k} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoKey, { color: theme.textSec, fontSize: fs(13) }]}>{k}</Text>
                <Text style={[styles.infoVal, { color: theme.textPrim, fontSize: fs(13) }]}>{v}</Text>
              </View>
            ))}
          </View>

          {/* ── ACCESIBILIDAD ── */}
          <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
            Accesibilidad
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>

            {/* Tema */}
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

            {/* Tamaño fuente */}
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
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.surface1, borderColor: '#FF5A5F' }]}
            onPress={logout}>
            <Text style={[styles.logoutText, { fontSize: fs(15) }]}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal configuración */}
      <Modal visible={modalConfig} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>Editar perfil</Text>

            {[
              { label: 'Nombre',      key: 'nombre',      keyboard: 'default' },
              { label: 'Email',       key: 'email',       keyboard: 'email-address' },
              { label: 'Teléfono',    key: 'telefono',    keyboard: 'phone-pad' },
              { label: 'Institución', key: 'institucion', keyboard: 'default' },
              { label: 'Ciudad',      key: 'ciudad',      keyboard: 'default' },
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
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nombre: { fontWeight: 'bold' },
  rol: { marginTop: 4 },
  rolBadge: { marginTop: 10, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14 },
  rolBadgeText: { fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 4 },
  statVal: { fontWeight: 'bold' },
  statLabel: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  editLink: { fontSize: 13 },
  catRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, padding: 14, marginBottom: 8 },
  catBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10 },
  catBadgeText: { fontSize: 13, fontWeight: 'bold' },
  catAlumnos: {},
  infoCard: { borderRadius: 12, padding: 16, marginBottom: 24 },
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
