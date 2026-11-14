import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useComunidad } from '../../../context/ComunidadContext';
import ScreenHeader from '../../../components/ScreenHeader';
import { elegirImagenes } from '../../../utils/imagenes';
import { formatLargo } from '../../../utils/fechas';
import { CATEGORIAS } from '../../../utils/eventos';

const VACIA = { titulo: '', cuerpo: '', categoria: 'Todas', imagen: null };

export default function NoticiasScreen({ route, navigation }) {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { getNoticias, publicarNoticia, editarNoticia, eliminarNoticia } = useComunidad();

  const esProfesor = user.rol === 'profesor';
  const conVolver = route?.params?.conVolver; // el profesor la abre como pantalla aparte
  const noticias = getNoticias(esProfesor ? undefined : user.categoria);

  const [abierta, setAbierta] = useState(null);       // noticia expandida (alumno)
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [draft, setDraft] = useState(VACIA);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (!modal) return;
    setDraft(editando ? { ...VACIA, ...editando } : VACIA);
    setErrores({});
  }, [modal, editando]);

  const fs = (s) => s * fontSize;
  const set = (k, v) => { setDraft((p) => ({ ...p, [k]: v })); setErrores((p) => ({ ...p, [k]: undefined })); };

  const abrirNueva = () => { setEditando(null); setModal(true); };
  const abrirEditar = (n) => { setEditando(n); setModal(true); };

  const ponerImagen = async () => {
    const [uri] = await elegirImagenes({ aspecto: [16, 9] });
    if (uri) set('imagen', uri);
  };

  const guardar = () => {
    const err = {};
    if (!draft.titulo.trim()) err.titulo = 'El título es obligatorio';
    if (!draft.cuerpo.trim()) err.cuerpo = 'Escribe el contenido de la noticia';
    if (Object.keys(err).length) { setErrores(err); return; }
    const datos = {
      titulo: draft.titulo.trim(), cuerpo: draft.cuerpo.trim(),
      categoria: draft.categoria, imagen: draft.imagen,
    };
    if (editando) editarNoticia(editando.id, datos);
    else publicarNoticia(datos, user.nombre);
    setModal(false);
  };

  const borrar = () => { eliminarNoticia(editando.id); setModal(false); };

  const Chip = ({ label, activo, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border },
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
        title="Noticias"
        subtitle={esProfesor ? 'Publica avisos para las familias' : `Novedades · ${user.categoria}`}
      />

      {(conVolver || esProfesor) && (
        <View style={styles.topRow}>
          {conVolver ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: theme.accent, fontSize: fs(16) }}>‹ Volver</Text>
            </TouchableOpacity>
          ) : <View />}
          {esProfesor && (
            <TouchableOpacity style={[styles.btnNueva, { backgroundColor: theme.accent }]} onPress={abrirNueva}>
              <Text style={{ color: '#0B0F14', fontWeight: 'bold', fontSize: fs(13) }}>+ Publicar noticia</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={noticias}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={[styles.vacio, { borderColor: theme.border, backgroundColor: theme.surface1 }]}>
            <Text style={{ color: theme.textMuted, fontSize: fs(13), textAlign: 'center' }}>
              {esProfesor ? 'Aún no hay noticias. Publica la primera.' : 'No hay noticias por ahora.'}
            </Text>
          </View>
        }
        renderItem={({ item: n }) => {
          const expandida = abierta === n.id;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (esProfesor ? abrirEditar(n) : setAbierta(expandida ? null : n.id))}
              style={[styles.card, { backgroundColor: theme.surface1 }]}
            >
              {n.imagen ? <Image source={{ uri: n.imagen }} style={styles.imagen} resizeMode="cover" /> : null}
              <View style={styles.cardBody}>
                <View style={styles.metaRow}>
                  <View style={[styles.tag, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                    <Text style={{ color: theme.accent, fontSize: fs(11), fontWeight: 'bold' }}>
                      {n.tema ? `${n.tema} · ` : ''}{n.categoria === 'Todas' ? 'Todas las categorías' : n.categoria}
                    </Text>
                  </View>
                  <Text style={{ color: theme.textMuted, fontSize: fs(11), textTransform: 'capitalize' }}>
                    {formatLargo(n.fecha)}
                  </Text>
                </View>
                <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(16) }]}>{n.titulo}</Text>
                {n.resumen ? (
                  <Text style={{ color: theme.textPrim, fontSize: fs(13), fontWeight: '600' }}>{n.resumen}</Text>
                ) : null}
                <Text
                  style={{ color: theme.textSec, fontSize: fs(13), lineHeight: fs(19) }}
                  numberOfLines={expandida || esProfesor ? undefined : 3}
                >
                  {n.cuerpo}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: fs(11), marginTop: 8 }}>
                  Por {n.autor}{esProfesor ? ' · toca para editar' : expandida ? '' : ' · toca para leer más'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal publicar / editar (solo profesor) */}
      {esProfesor && (
        <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
          <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface1 }]}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={[styles.modalTitulo, { color: theme.textPrim, fontSize: fs(18) }]}>
                  {editando ? 'Editar noticia' : 'Nueva noticia'}
                </Text>

                <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Título *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim,
                    borderColor: errores.titulo ? '#FF5A5F' : theme.border, fontSize: fs(15) }]}
                  value={draft.titulo}
                  onChangeText={(t) => set('titulo', t)}
                  placeholder="Ej: Cambio de horario del viernes"
                  placeholderTextColor={theme.textMuted}
                />
                {errores.titulo ? <Text style={styles.error}>{errores.titulo}</Text> : null}

                <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Contenido *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, minHeight: 110,
                    textAlignVertical: 'top', borderColor: errores.cuerpo ? '#FF5A5F' : theme.border, fontSize: fs(15) }]}
                  value={draft.cuerpo}
                  onChangeText={(t) => set('cuerpo', t)}
                  placeholder="Escribe el aviso para las familias…"
                  placeholderTextColor={theme.textMuted}
                  multiline
                />
                {errores.cuerpo ? <Text style={styles.error}>{errores.cuerpo}</Text> : null}

                <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Dirigida a</Text>
                <View style={styles.chips}>
                  {['Todas', ...CATEGORIAS].map((c) => (
                    <Chip key={c} label={c} activo={draft.categoria === c} onPress={() => set('categoria', c)} />
                  ))}
                </View>

                <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Foto (opcional)</Text>
                {draft.imagen ? (
                  <View>
                    <Image source={{ uri: draft.imagen }} style={styles.preview} resizeMode="cover" />
                    <TouchableOpacity onPress={() => set('imagen', null)} style={{ marginTop: 6 }}>
                      <Text style={{ color: '#FF5A5F', fontSize: fs(13) }}>Quitar foto</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.btnFoto, { borderColor: theme.border, backgroundColor: theme.bg }]}
                    onPress={ponerImagen}
                  >
                    <Text style={{ color: theme.accent, fontSize: fs(14), fontWeight: 'bold' }}>📷 Agregar foto</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.botones}>
                  <TouchableOpacity
                    style={[styles.btnCancelar, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => setModal(false)}
                  >
                    <Text style={{ color: theme.textSec, fontSize: fs(15) }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: theme.accent }]} onPress={guardar}>
                    <Text style={{ color: '#0B0F14', fontSize: fs(15), fontWeight: 'bold' }}>
                      {editando ? 'Guardar cambios' : 'Publicar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {editando && (
                  <TouchableOpacity style={styles.btnBorrar} onPress={borrar}>
                    <Text style={{ color: '#FF5A5F', fontSize: fs(14), fontWeight: 'bold' }}>Eliminar noticia</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
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
  btnNueva: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  lista: { padding: 20, paddingBottom: 60 },
  vacio: { borderRadius: 12, padding: 24, borderWidth: 1, borderStyle: 'dashed' },
  card: { borderRadius: 14, marginBottom: 14, overflow: 'hidden' },
  imagen: { width: '100%', height: 170 },
  cardBody: { padding: 14, gap: 6 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  titulo: { fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36, maxHeight: '92%' },
  modalTitulo: { fontWeight: 'bold', marginBottom: 4 },
  label: { marginTop: 14, marginBottom: 6 },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  error: { color: '#FF5A5F', fontSize: 11, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  btnFoto: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 14, alignItems: 'center' },
  preview: { width: '100%', height: 150, borderRadius: 10 },
  botones: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancelar: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  btnGuardar: { flex: 1.3, borderRadius: 10, padding: 14, alignItems: 'center' },
  btnBorrar: { alignItems: 'center', paddingVertical: 16, marginTop: 6 },
});
