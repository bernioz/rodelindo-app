import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useComunidad } from '../../../context/ComunidadContext';
import ScreenHeader from '../../../components/ScreenHeader';
import { elegirImagenes } from '../../../utils/imagenes';
import { formatLargo } from '../../../utils/fechas';
import { CATEGORIAS } from '../../../utils/eventos';

export default function GaleriaScreen({ route, navigation }) {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { getFotos, subirFotos, eliminarFoto } = useComunidad();

  const esProfesor = user.rol === 'profesor';
  const conVolver = route?.params?.conVolver;

  const [filtro, setFiltro] = useState('Todas');      // solo para el profesor
  const [pendientes, setPendientes] = useState([]);   // fotos elegidas, antes de subirlas
  const [categoria, setCategoria] = useState('Todas');
  const [descripcion, setDescripcion] = useState('');
  const [visor, setVisor] = useState(null);           // foto abierta en grande

  const fs = (s) => s * fontSize;

  // Alumno: ve las de "Todas" y las de su categoría. Profesor: todas, con filtro opcional.
  const todas = getFotos(esProfesor ? undefined : user.categoria);
  const fotos = esProfesor && filtro !== 'Todas' ? todas.filter((f) => f.categoria === filtro) : todas;

  const elegir = async () => {
    const uris = await elegirImagenes({ multiple: true });
    if (uris.length === 0) return;
    setPendientes(uris);
    setCategoria('Todas');
    setDescripcion('');
  };

  const subir = () => {
    subirFotos(pendientes, { categoria, descripcion: descripcion.trim() });
    setPendientes([]);
  };

  const confirmarBorrado = (foto) => {
    Alert.alert('Eliminar foto', '¿Quieres eliminar esta foto de la galería?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarFoto(foto.id); setVisor(null); } },
    ]);
  };

  const Chip = ({ label, activo, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { backgroundColor: theme.surface1, borderColor: theme.border },
        activo && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}
    >
      <Text style={{ fontSize: fs(13), color: activo ? '#fff' : theme.textSec, fontWeight: activo ? 'bold' : '500' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title="Galería"
        subtitle={esProfesor ? 'Sube fotos de entrenamientos y torneos' : `Fotos · ${user.categoria}`}
      />

      {(conVolver || esProfesor) && (
        <View style={styles.topRow}>
          {conVolver ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: theme.accent, fontSize: fs(16) }}>‹ Volver</Text>
            </TouchableOpacity>
          ) : <View />}
          {esProfesor && (
            <TouchableOpacity style={[styles.btnSubir, { backgroundColor: theme.accent }]} onPress={elegir}>
              <Text style={{ color: '#0B0F14', fontWeight: 'bold', fontSize: fs(13) }}>+ Subir fotos</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {esProfesor && (
        <View style={styles.filtroWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtroRow}>
            {['Todas', ...CATEGORIAS].map((c) => (
              <Chip key={c} label={c} activo={filtro === c} onPress={() => setFiltro(c)} />
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.grilla}>
        {fotos.length === 0 ? (
          <View style={[styles.vacio, { borderColor: theme.border, backgroundColor: theme.surface1 }]}>
            <Text style={{ color: theme.textMuted, fontSize: fs(13), textAlign: 'center' }}>
              {esProfesor ? 'Aún no hay fotos. Toca "+ Subir fotos".' : 'Todavía no hay fotos publicadas.'}
            </Text>
          </View>
        ) : (
          <View style={styles.fila}>
            {fotos.map((f) => (
              <TouchableOpacity key={f.id} style={styles.celda} activeOpacity={0.8} onPress={() => setVisor(f)}>
                <Image source={{ uri: f.uri }} style={styles.foto} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Visor de foto */}
      <Modal visible={!!visor} transparent animationType="fade" onRequestClose={() => setVisor(null)}>
        <View style={styles.visorFondo}>
          {visor && (
            <>
              <Image source={{ uri: visor.uri }} style={styles.visorImagen} resizeMode="contain" />
              <View style={styles.visorInfo}>
                {visor.descripcion ? <Text style={styles.visorTexto}>{visor.descripcion}</Text> : null}
                <Text style={styles.visorMeta}>
                  {visor.tema ? `${visor.tema} · ` : ''}{visor.categoria === 'Todas' ? 'Todas las categorías' : visor.categoria} · {formatLargo(visor.fecha)}
                </Text>
              </View>
              <View style={styles.visorBotones}>
                {esProfesor && (
                  <TouchableOpacity style={styles.btnEliminar} onPress={() => confirmarBorrado(visor)}>
                    <Text style={{ color: '#FF5A5F', fontWeight: 'bold' }}>Eliminar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.btnCerrar} onPress={() => setVisor(null)}>
                  <Text style={{ color: '#0B0F14', fontWeight: 'bold' }}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Modal para subir (solo profesor) */}
      {esProfesor && (
        <Modal visible={pendientes.length > 0} transparent animationType="slide" onRequestClose={() => setPendientes([])}>
          <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
              <Text style={[styles.modalTitulo, { color: theme.textPrim, fontSize: fs(18) }]}>
                Subir {pendientes.length} foto{pendientes.length === 1 ? '' : 's'}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                {pendientes.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.miniatura} resizeMode="cover" />
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Visible para</Text>
              <View style={styles.chips}>
                {['Todas', ...CATEGORIAS].map((c) => (
                  <Chip key={c} label={c} activo={categoria === c} onPress={() => setCategoria(c)} />
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim,
                  borderColor: theme.border, fontSize: fs(15) }]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Ej: Torneo regional, 3.er lugar"
                placeholderTextColor={theme.textMuted}
              />

              <View style={styles.botones}>
                <TouchableOpacity
                  style={[styles.btnCancelar, { backgroundColor: theme.bg, borderColor: theme.border }]}
                  onPress={() => setPendientes([])}
                >
                  <Text style={{ color: theme.textSec, fontSize: fs(15) }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: theme.accent }]} onPress={subir}>
                  <Text style={{ color: '#0B0F14', fontSize: fs(15), fontWeight: 'bold' }}>Subir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 },
  btnSubir: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  filtroWrap: { height: 48, flexShrink: 0 },
  filtroRow: { paddingHorizontal: 20, gap: 8, alignItems: 'center', paddingVertical: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  grilla: { padding: 14, paddingBottom: 60 },
  fila: { flexDirection: 'row', flexWrap: 'wrap' },
  celda: { width: '33.3333%', aspectRatio: 1, padding: 3 },
  foto: { width: '100%', height: '100%', borderRadius: 8 },
  vacio: { borderRadius: 12, padding: 24, borderWidth: 1, borderStyle: 'dashed', margin: 6 },
  visorFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 16 },
  visorImagen: { width: '100%', height: '65%' },
  visorInfo: { marginTop: 14, gap: 4 },
  visorTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  visorMeta: { color: '#9aa3b2', fontSize: 12, textTransform: 'capitalize' },
  visorBotones: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnEliminar: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: '#FF5A5F', padding: 14, alignItems: 'center' },
  btnCerrar: { flex: 1, borderRadius: 10, backgroundColor: '#3DDC84', padding: 14, alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  modalTitulo: { fontWeight: 'bold' },
  miniatura: { width: 70, height: 70, borderRadius: 8, marginRight: 8 },
  label: { marginTop: 14, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  botones: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancelar: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  btnGuardar: { flex: 1.3, borderRadius: 10, padding: 14, alignItems: 'center' },
});
