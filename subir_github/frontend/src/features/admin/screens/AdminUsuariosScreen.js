import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import ScreenHeader from '../../../components/ScreenHeader';

const CATEGORIAS = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];

export default function AdminUsuariosScreen({ navigation }) {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  const { alumnos, agregarAlumno, actualizarAlumno, eliminarAlumno } = useAlumnos();

  // Profesores y administradores iniciales
  const [profesores, setProfesores] = useState([
    { id: 101, nombre_completo: 'Prof. Rodrigo Vera', categorias: ['Sub-8', 'Sub-12'], email: 'profesor@test.com', telefono: '+56 9 8765 4321' },
    { id: 102, nombre_completo: 'Prof. Marcelo Salas', categorias: ['Sub-14', 'Sub-16'], email: 'marcelo@test.com', telefono: '+56 9 7654 3210' },
  ]);

  const [administradores, setAdministradores] = useState([
    { id: 99, nombre_completo: 'Sebastián Varela', cargo: 'Director General', email: 'admin@test.com', telefono: '+56 9 1122 3344' },
  ]);

  const [tabRol, setTabRol] = useState('alumnos'); // 'alumnos' | 'profesores' | 'admins'
  const [busqueda, setBusqueda] = useState('');

  // Modal para agregar/editar
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null); // null = nuevo
  const [form, setForm] = useState({
    nombre_completo: '',
    rol: 'alumnos',
    categoria: 'Sub-12',
    numero_camiseta: '',
    posicion: 'Delantero',
    email: '',
    telefono: '',
    cargo: 'Coordinador',
  });

  const abrirModalNuevo = () => {
    setUsuarioEditando(null);
    setForm({
      nombre_completo: '',
      rol: tabRol,
      categoria: 'Sub-12',
      numero_camiseta: '10',
      posicion: 'Delantero',
      email: '',
      telefono: '',
      cargo: 'Coordinador',
    });
    setModalVisible(true);
  };

  const abrirModalEditar = (u, rol) => {
    setUsuarioEditando(u);
    setForm({
      nombre_completo: u.nombre_completo || '',
      rol: rol,
      categoria: u.categoria || 'Sub-12',
      numero_camiseta: u.numero_camiseta ? String(u.numero_camiseta) : '10',
      posicion: u.posicion || 'Delantero',
      email: u.email || '',
      telefono: u.telefono || '',
      cargo: u.cargo || 'Coordinador',
    });
    setModalVisible(true);
  };

  const guardarUsuario = () => {
    if (!form.nombre_completo.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre completo del usuario.');
      return;
    }

    if (usuarioEditando) {
      if (form.rol === 'alumnos') {
        actualizarAlumno(usuarioEditando.id, {
          nombre_completo: form.nombre_completo,
          categoria: form.categoria,
          numero_camiseta: parseInt(form.numero_camiseta) || 10,
          posicion: form.posicion,
          email: form.email,
          telefono: form.telefono,
        });
      } else if (form.rol === 'profesores') {
        setProfesores((prev) =>
          prev.map((p) =>
            p.id === usuarioEditando.id
              ? { ...p, nombre_completo: form.nombre_completo, email: form.email, telefono: form.telefono }
              : p
          )
        );
      } else {
        setAdministradores((prev) =>
          prev.map((a) =>
            a.id === usuarioEditando.id
              ? { ...a, nombre_completo: form.nombre_completo, cargo: form.cargo, email: form.email, telefono: form.telefono }
              : a
          )
        );
      }
    } else {
      if (form.rol === 'alumnos') {
        agregarAlumno(form);
      } else if (form.rol === 'profesores') {
        setProfesores((prev) => [
          ...prev,
          { id: Date.now(), nombre_completo: form.nombre_completo, categorias: [form.categoria], email: form.email, telefono: form.telefono },
        ]);
      } else {
        setAdministradores((prev) => [
          ...prev,
          { id: Date.now(), nombre_completo: form.nombre_completo, cargo: form.cargo, email: form.email, telefono: form.telefono },
        ]);
      }
    }

    setModalVisible(false);
  };

  const confirmarEliminar = (u, rol) => {
    Alert.alert(
      'Eliminar Cuenta',
      `¿Estás seguro de que deseas eliminar la cuenta de ${u.nombre_completo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            if (rol === 'alumnos') eliminarAlumno(u.id);
            else if (rol === 'profesores') setProfesores((prev) => prev.filter((p) => p.id !== u.id));
            else setAdministradores((prev) => prev.filter((a) => a.id !== u.id));
          },
        },
      ]
    );
  };

  const alumnosFiltrados = alumnos.filter((a) =>
    a.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const profesFiltrados = profesores.filter((p) =>
    p.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const adminsFiltrados = administradores.filter((a) =>
    a.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface1 }]} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.textPrim }}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      <ScreenHeader title="Gestión de Usuarios" subtitle="Control global de alumnos, profesores y directiva" />

      <View style={styles.inner}>

        {/* Buscador */}
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface1, color: theme.textPrim, borderColor: theme.border }]}
          placeholder="Buscar por nombre o categoría..."
          placeholderTextColor={theme.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {/* Selector de Roles */}
        <View style={[styles.roleTabs, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.roleTabBtn, tabRol === 'alumnos' && { backgroundColor: theme.accentDark }]}
            onPress={() => setTabRol('alumnos')}
          >
            <Text style={[styles.roleTabText, { color: tabRol === 'alumnos' ? '#fff' : theme.textSec, fontSize: fs(12) }]}>
              Alumnos ({alumnos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTabBtn, tabRol === 'profesores' && { backgroundColor: theme.accentDark }]}
            onPress={() => setTabRol('profesores')}
          >
            <Text style={[styles.roleTabText, { color: tabRol === 'profesores' ? '#fff' : theme.textSec, fontSize: fs(12) }]}>
              Profesores ({profesores.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTabBtn, tabRol === 'admins' && { backgroundColor: theme.accentDark }]}
            onPress={() => setTabRol('admins')}
          >
            <Text style={[styles.roleTabText, { color: tabRol === 'admins' ? '#fff' : theme.textSec, fontSize: fs(12) }]}>
              Admins ({administradores.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón Nuevo Usuario */}
        <TouchableOpacity style={styles.addBtn} onPress={abrirModalNuevo}>
          <Text style={[styles.addBtnText, { fontSize: fs(14) }]}>+ Crear nuevo {tabRol.slice(0, -1)}</Text>
        </TouchableOpacity>

        {/* LISTADO ALUMNOS */}
        {tabRol === 'alumnos' && (
          <View style={styles.list}>
            {alumnosFiltrados.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.textPrim, fontSize: fs(15) }]}>
                      {item.nombre_completo}
                    </Text>
                    <Text style={[styles.userSub, { color: theme.textSec, fontSize: fs(12) }]}>
                      {item.categoria} · #{item.numero_camiseta || 10} ({item.posicion || 'Delantero'})
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: 'rgba(61,220,132,0.15)' }]}>
                    <Text style={{ color: '#3DDC84', fontSize: fs(11), fontWeight: 'bold' }}>{item.asistencia}% asist.</Text>
                  </View>
                </View>

                {item.email ? <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>✉️ {item.email}</Text> : null}
                {item.telefono ? <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>📞 {item.telefono}</Text> : null}

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.accent }]} onPress={() => abrirModalEditar(item, 'alumnos')}>
                    <Text style={{ color: theme.accent, fontSize: fs(12), fontWeight: 'bold' }}>Editar datos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionBtn, { borderColor: '#FF5A5F' }]} onPress={() => confirmarEliminar(item, 'alumnos')}>
                    <Text style={{ color: '#FF5A5F', fontSize: fs(12), fontWeight: 'bold' }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LISTADO PROFESORES */}
        {tabRol === 'profesores' && (
          <View style={styles.list}>
            {profesFiltrados.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.textPrim, fontSize: fs(15) }]}>
                      {item.nombre_completo}
                    </Text>
                    <Text style={[styles.userSub, { color: theme.textSec, fontSize: fs(12) }]}>
                      Categorías: {item.categorias.join(', ')}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>✉️ {item.email}</Text>
                <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>📞 {item.telefono}</Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.accent }]} onPress={() => abrirModalEditar(item, 'profesores')}>
                    <Text style={{ color: theme.accent, fontSize: fs(12), fontWeight: 'bold' }}>Editar datos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionBtn, { borderColor: '#FF5A5F' }]} onPress={() => confirmarEliminar(item, 'profesores')}>
                    <Text style={{ color: '#FF5A5F', fontSize: fs(12), fontWeight: 'bold' }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LISTADO ADMINISTRADORES */}
        {tabRol === 'admins' && (
          <View style={styles.list}>
            {adminsFiltrados.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.textPrim, fontSize: fs(15) }]}>
                      {item.nombre_completo}
                    </Text>
                    <Text style={[styles.userSub, { color: theme.textSec, fontSize: fs(12) }]}>
                      Rol: {item.cargo}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>✉️ {item.email}</Text>
                <Text style={[styles.contactText, { color: theme.textMuted, fontSize: fs(11) }]}>📞 {item.telefono}</Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.accent }]} onPress={() => abrirModalEditar(item, 'admins')}>
                    <Text style={{ color: theme.accent, fontSize: fs(12), fontWeight: 'bold' }}>Editar datos</Text>
                  </TouchableOpacity>

                  {item.id !== 99 && (
                    <TouchableOpacity style={[styles.actionBtn, { borderColor: '#FF5A5F' }]} onPress={() => confirmarEliminar(item, 'admins')}>
                      <Text style={{ color: '#FF5A5F', fontSize: fs(12), fontWeight: 'bold' }}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

      </View>

      {/* Modal Crear / Editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrim }]}>
              {usuarioEditando ? 'Editar Usuario' : 'Crear Usuario'}
            </Text>

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Nombre Completo</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
              value={form.nombre_completo}
              onChangeText={(t) => setForm((p) => ({ ...p, nombre_completo: t }))}
              placeholder="Ej: Pedro Soto"
              placeholderTextColor={theme.textMuted}
            />

            {form.rol === 'alumnos' && (
              <>
                <Text style={[styles.modalLabel, { color: theme.textSec }]}>Categoría</Text>
                <View style={styles.catRow}>
                  {CATEGORIAS.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catChip, { backgroundColor: theme.bg, borderColor: theme.border }, form.categoria === cat && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                      onPress={() => setForm((p) => ({ ...p, categoria: cat }))}
                    >
                      <Text style={{ color: form.categoria === cat ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalLabel, { color: theme.textSec }]}>Dorsal (#)</Text>
                    <TextInput
                      style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                      value={form.numero_camiseta}
                      onChangeText={(t) => setForm((p) => ({ ...p, numero_camiseta: t }))}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalLabel, { color: theme.textSec }]}>Posición</Text>
                    <TextInput
                      style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                      value={form.posicion}
                      onChangeText={(t) => setForm((p) => ({ ...p, posicion: t }))}
                    />
                  </View>
                </View>
              </>
            )}

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Correo electrónico</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
              value={form.email}
              onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="contacto@ejemplo.com"
              placeholderTextColor={theme.textMuted}
            />

            <Text style={[styles.modalLabel, { color: theme.textSec }]}>Teléfono de contacto</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
              value={form.telefono}
              onChangeText={(t) => setForm((p) => ({ ...p, telefono: t }))}
              keyboardType="phone-pad"
              placeholder="+56 9 ..."
              placeholderTextColor={theme.textMuted}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: theme.textSec }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={guardarUsuario}>
                <Text style={styles.modalSaveText}>Guardar</Text>
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
  inner: { padding: 20, gap: 14 },
  searchInput: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, fontSize: 14 },
  roleTabs: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3 },
  roleTabBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  roleTabText: { fontWeight: 'bold' },
  addBtn: { backgroundColor: '#3DDC84', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  addBtnText: { color: '#0B0F14', fontWeight: 'bold' },
  list: { gap: 12 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfo: { flex: 1 },
  userName: { fontWeight: 'bold' },
  userSub: { marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  contactText: { marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  actionBtn: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  modalLabel: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  modalInput: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 14 },
  modalCancel: { flex: 1, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1 },
  modalSave: { flex: 1, backgroundColor: '#3DDC84', borderRadius: 10, padding: 12, alignItems: 'center' },
  modalSaveText: { color: '#0B0F14', fontWeight: 'bold' },
});