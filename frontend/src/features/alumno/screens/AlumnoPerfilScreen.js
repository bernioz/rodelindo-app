import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Switch, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { meses, getIniciales } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

const FONT_SIZES = [
  { label: 'Pequeño', value: 0.85 },
  { label: 'Normal',  value: 1.0  },
  { label: 'Grande',  value: 1.2  },
];

export default function AlumnoPerfilScreen() {
  const { user, logout } = useAuth();
  const { theme, mode, toggleMode, fontSize, setFontSize } = useTheme();
  const { alumnos, getByCategoria } = useAlumnos();

  const alumno = alumnos.find((a) => a.id === user.alumnoId);

  // Selector de vista: 'publica' (Ficha Deportiva) | 'privada' (Gestión Apoderado)
  const [vista, setVista] = useState('publica');

  // Estados para datos de apoderado
  const [modalConfig, setModalConfig] = useState(false);
  const [config, setConfig] = useState({
    nombreApoderado: 'Carlos González',
    telefono: '+56 9 1234 5678',
    email: 'carlos.gonzalez@gmail.com',
  });
  const [configDraft, setConfigDraft] = useState(config);

  // Estado para la foto de perfil (URI local de la galería)
  const [fotoPerfil, setFotoPerfil] = useState(null);

  if (!alumno) return null;

  const fs = (s) => s * fontSize;
  const mesesPagados = Object.values(alumno.pagos).filter(Boolean).length;
  const MES_ACTUAL = new Date().getMonth() + 1;

  // Cálculo de posición en ranking de su categoría
  const rankingCat = [...getByCategoria(alumno.categoria)].sort((a, b) => b.asistencia - a.asistencia);
  const posRanking = rankingCat.findIndex((a) => a.id === alumno.id) + 1;

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

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a tus fotos para cambiar la imagen de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  const manejarOpcionesFoto = () => {
    if (fotoPerfil) {
      Alert.alert(
        'Foto de perfil',
        '¿Qué deseas hacer con tu foto de perfil?',
        [
          { text: 'Cambiar foto', onPress: abrirGaleria },
          { text: 'Eliminar foto', onPress: () => setFotoPerfil(null), style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } else {
      abrirGaleria();
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
        <ScreenHeader title="Mi Perfil" subtitle="FC Rodelindo Román" />

        <View style={styles.inner}>

          {/* Header común: Avatar, Nombre, Categoría y Camiseta */}
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={manejarOpcionesFoto} style={styles.avatarWrapper} activeOpacity={0.8}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: theme.accentDark }]}>
                  <Text style={[styles.avatarText, { fontSize: fs(26) }]}>
                    {getIniciales(alumno.nombre_completo)}
                  </Text>
                </View>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: theme.accent }]}>
                <Text style={{ fontSize: 12 }}>📷</Text>
              </View>
            </TouchableOpacity>

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

          {/* Conmutador Selector Vista Pública vs Vista Privada */}
          <View style={[styles.tabSelector, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.tabSelectorBtn, vista === 'publica' && { backgroundColor: theme.accentDark }]}
              onPress={() => setVista('publica')}
            >
              <Text style={[styles.tabSelectorText, { color: vista === 'publica' ? '#fff' : theme.textSec, fontSize: fs(13) }]}>
                ⚽ Ficha Deportiva
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabSelectorBtn, vista === 'privada' && { backgroundColor: theme.accentDark }]}
              onPress={() => setVista('privada')}
            >
              <Text style={[styles.tabSelectorText, { color: vista === 'privada' ? '#fff' : theme.textSec, fontSize: fs(13) }]}>
                🔒 Gestión Apoderado
              </Text>
            </TouchableOpacity>
          </View>

          {/* CONTENIDO VISTA PÚBLICA (Ficha Deportiva) */}
          {vista === 'publica' && (
            <View style={styles.sectionGap}>
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
          )}

          {/* CONTENIDO VISTA PRIVADA (Apoderado / Administración) */}
          {vista === 'privada' && (
            <View style={styles.sectionGap}>
              <View style={styles.statsRow}>
                {[
                  { val: `${alumno.asistencia}%`, label: 'Asistencia', color: colorPct(alumno.asistencia) },
                  { val: mesesPagados, label: 'Meses pagados', color: theme.accent },
                  { val: alumno.matricula ? '✓' : '✗', label: 'Matrícula', color: alumno.matricula ? theme.accent : '#FF5A5F' },
                ].map((s, i) => (
                  <View key={i} style={[styles.statCard, { backgroundColor: theme.surface1 }]}>
                    <Text style={[styles.statVal, { color: s.color, fontSize: fs(22) }]}>{s.val}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSec, fontSize: fs(10) }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                Estado de pagos 2026
              </Text>
              <View style={[styles.pagosCard, { backgroundColor: theme.surface1 }]}>
                <View style={styles.matriculaRow}>
                  <Text style={[styles.pagosLabel, { color: theme.textPrim, fontSize: fs(14) }]}>Matrícula</Text>
                  <View style={[styles.estadoBadge, alumno.matricula ? styles.badgePagado : styles.badgePendiente]}>
                    <Text style={[styles.estadoBadgeText, alumno.matricula ? styles.badgeTextPagado : styles.badgeTextPendiente, { fontSize: fs(12) }]}>
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
              </View>

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

              <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>Accesibilidad</Text>
              <View style={[styles.infoCard, { backgroundColor: theme.surface1 }]}>
                <View style={[styles.accessRow, { borderBottomColor: theme.border }]}>
                  <View>
                    <Text style={[styles.accessLabel, { color: theme.textPrim, fontSize: fs(14) }]}>Fondo claro</Text>
                    <Text style={[styles.accessSub, { color: theme.textSec, fontSize: fs(11) }]}>Cambia entre tema oscuro y claro</Text>
                  </View>
                  <Switch
                    value={mode === 'light'}
                    onValueChange={toggleMode}
                    trackColor={{ false: theme.border, true: theme.accent }}
                    thumbColor="#fff"
                  />
                </View>
                <View style={styles.accessRow}>
                  <Text style={[styles.accessLabel, { color: theme.textPrim, fontSize: fs(14) }]}>Tamaño de letra</Text>
                </View>
                <View style={styles.fontSizeRow}>
                  {FONT_SIZES.map((f) => (
                    <TouchableOpacity key={f.label}
                      style={[styles.fontBtn, { backgroundColor: theme.bg, borderColor: theme.border },
                        fontSize === f.value && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}
                      onPress={() => setFontSize(f.value)}>
                      <Text style={[styles.fontBtnText, { color: fontSize === f.value ? '#fff' : theme.textSec, fontSize: f.value * 13 }]}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.surface1, borderColor: '#FF5A5F' }]} onPress={logout}>
                <Text style={[styles.logoutText, { fontSize: fs(15) }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Modal editar apoderado */}
      <Modal visible={modalConfig} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                  style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                  value={configDraft[key]}
                  onChangeText={(t) => setConfigDraft((p) => ({ ...p, [key]: t }))}
                  keyboardType={keyboard}
                  autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            ))}
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => setModalConfig(false)}>
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
  profileHeader: { alignItems: 'center', marginBottom: 16 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 84, height: 84, borderRadius: 42 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0B0F14' },
  nombre: { fontWeight: 'bold', textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  catBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  catBadgeText: { fontWeight: 'bold' },
  tabSelector: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 20 },
  tabSelectorBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabSelectorText: { fontWeight: 'bold' },
  sectionGap: { gap: 12 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editLink: {},
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statCardBig: { width: '48%', borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statValBig: { fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statVal: { fontWeight: 'bold' },
  statLabel: { textAlign: 'center' },
  pagosCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
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
  infoCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
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
  modalLabel: { fontSize: 12, marginBottom: 6, marginTop: 8 },
  modalInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  modalCancelText: { fontSize: 15 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 14, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontSize: 15, fontWeight: 'bold' },
});