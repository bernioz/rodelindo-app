import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../context/ThemeContext';
import { useEventos } from '../../../context/EventosContext';
import { categorias as LISTA_CATEGORIAS } from '../../../data/mockData';
import ScreenHeader from '../../../components/ScreenHeader';

// Datos de prueba iniciales para noticias e imágenes de galería
const INITIAL_NOTICIAS = [
  {
    id: 1,
    titulo: 'Gran Torneo de Clausura 2026',
    fecha: '2026-11-01',
    categoria: 'General',
    resumen: 'Este fin de semana disputaremos las finales de todas las categorías.',
    contenido: 'Los partidos se llevarán a cabo en la cancha principal. Esperamos contar con todo el apoyo de apoderados y alumnos.',
    imagen: 'https://via.placeholder.com/400x200/1A6B3A/FFFFFF?text=Torneo+Clausura',
  },
  {
    id: 2,
    titulo: 'Entrega de Nuevas Indumentarias',
    fecha: '2026-10-25',
    categoria: 'Institucional',
    resumen: 'Llegaron los uniformes oficiales de la temporada 2026-2027.',
    contenido: 'Recordamos retirar los uniformes en la secretaría del club antes de cada entrenamiento.',
    imagen: 'https://via.placeholder.com/400x200/0B0F14/FFFFFF?text=Nuevos+Uniformes',
  }
];

const INITIAL_GALERIA = [
  {
    id: 1,
    titulo: 'Entrenamiento Sub-12 Cancha 1',
    fecha: '2026-11-04',
    categoria: 'Entrenamientos',
    imagen: 'https://via.placeholder.com/600x350/1A6B3A/FFFFFF?text=Entrenamiento+Sub-12',
  },
  {
    id: 2,
    titulo: 'Celebración Aniversario Club',
    fecha: '2026-10-18',
    categoria: 'Eventos',
    imagen: 'https://via.placeholder.com/600x350/0B0F14/FFFFFF?text=Aniversario+Rodelindo',
  }
];

export default function AdminPublicacionesScreen({ navigation }) {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  const { eventos, agregarEvento, eliminarEvento, editarEvento } = useEventos();

  // Pestaña activa: 'noticia' | 'galeria' | 'evento'
  const [tabActual, setTabActual] = useState('noticia');

  // Estado de despliegue del formulario (colapsado por defecto)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Filtro de Búsqueda por Texto
  const [busqueda, setBusqueda] = useState('');

  // Filtro de Categoría para Eventos ('Todas' o Sub-8, Sub-10, etc.)
  const [filtroCatEvento, setFiltroCatEvento] = useState('Todas');

  // Listas de Estado (Histórico)
  const [noticiasList, setNoticiasList] = useState(INITIAL_NOTICIAS);
  const [galeriaList, setGaleriaList] = useState(INITIAL_GALERIA);

  // Estados de Edición (ID del elemento editado)
  const [editandoNoticiaId, setEditandoNoticiaId] = useState(null);
  const [editandoGaleriaId, setEditandoGaleriaId] = useState(null);
  const [editandoEventoId, setEditandoEventoId] = useState(null);

  // Formulario Noticia
  const [formNoticia, setFormNoticia] = useState({
    titulo: '',
    categoria: 'General',
    resumen: '',
    contenido: '',
    imagen: '',
  });

  // Formulario Galería
  const [formGaleria, setFormGaleria] = useState({
    titulo: '',
    categoria: 'Entrenamientos',
    imagen: '',
  });

  // Formulario Evento
  const todayStr = new Date().toISOString().split('T')[0];
  const [formEvento, setFormEvento] = useState({
    titulo: '',
    tipo: 'Entrenamiento',
    fecha: todayStr,
    hora: '17:00 hrs',
    lugar: 'Cancha Principal Rodelindo',
    categoriasSel: ['Sub-12'],
  });

  // Galería Nativa del Teléfono
  const seleccionarFotoTelefono = async (onFotoSeleccionada) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a tus fotos para subir imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onFotoSeleccionada(result.assets[0].uri);
    }
  };

  const resetFormularios = () => {
    setEditandoNoticiaId(null);
    setEditandoGaleriaId(null);
    setEditandoEventoId(null);
    setFormNoticia({ titulo: '', categoria: 'General', resumen: '', contenido: '', imagen: '' });
    setFormGaleria({ titulo: '', categoria: 'Entrenamientos', imagen: '' });
    setFormEvento({ titulo: '', tipo: 'Entrenamiento', fecha: todayStr, hora: '17:00 hrs', lugar: 'Cancha Principal Rodelindo', categoriasSel: ['Sub-12'] });
    setMostrarFormulario(false);
  };

  // --- ACCIONES NOTICIAS ---
  const guardarNoticia = () => {
    if (!formNoticia.titulo.trim() || !formNoticia.resumen.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y resumen para la noticia.');
      return;
    }

    const imgFinal = formNoticia.imagen.trim() || 'https://via.placeholder.com/400x200/1A6B3A/FFFFFF?text=Noticia+Rodelindo';

    if (editandoNoticiaId) {
      setNoticiasList((prev) =>
        prev.map((item) =>
          item.id === editandoNoticiaId ? { ...item, ...formNoticia, imagen: imgFinal } : item
        )
      );
      Alert.alert('Éxito', 'La noticia ha sido actualizada correctamente.');
    } else {
      const nuevaNoticia = { id: Date.now(), fecha: todayStr, ...formNoticia, imagen: imgFinal };
      setNoticiasList((prev) => [nuevaNoticia, ...prev]);
      Alert.alert('Éxito', 'La noticia ha sido publicada.');
    }

    resetFormularios();
  };

  const prepararEdicionNoticia = (item) => {
    setEditandoNoticiaId(item.id);
    setFormNoticia({
      titulo: item.titulo,
      categoria: item.categoria,
      resumen: item.resumen,
      contenido: item.contenido,
      imagen: item.imagen,
    });
    setMostrarFormulario(true);
  };

  const eliminarNoticia = (id) => {
    Alert.alert('Confirmar eliminación', '¿Deseas eliminar esta noticia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setNoticiasList((prev) => prev.filter((item) => item.id !== id));
          if (editandoNoticiaId === id) resetFormularios();
        },
      },
    ]);
  };

  // --- ACCIONES GALERÍA ---
  const guardarGaleria = () => {
    if (!formGaleria.titulo.trim()) {
      Alert.alert('Error', 'Ingresa un título para la fotografía.');
      return;
    }

    const imgFinal = formGaleria.imagen.trim() || 'https://via.placeholder.com/600x350/1A6B3A/FFFFFF?text=Foto+Galeria';

    if (editandoGaleriaId) {
      setGaleriaList((prev) =>
        prev.map((item) =>
          item.id === editandoGaleriaId ? { ...item, ...formGaleria, imagen: imgFinal } : item
        )
      );
      Alert.alert('Éxito', 'La imagen ha sido actualizada.');
    } else {
      const nuevaFoto = { id: Date.now(), fecha: todayStr, ...formGaleria, imagen: imgFinal };
      setGaleriaList((prev) => [nuevaFoto, ...prev]);
      Alert.alert('Éxito', 'La imagen ha sido añadida a la galería.');
    }

    resetFormularios();
  };

  const prepararEdicionGaleria = (item) => {
    setEditandoGaleriaId(item.id);
    setFormGaleria({
      titulo: item.titulo,
      categoria: item.categoria,
      imagen: item.imagen,
    });
    setMostrarFormulario(true);
  };

  const eliminarGaleria = (id) => {
    Alert.alert('Confirmar eliminación', '¿Deseas eliminar esta imagen?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setGaleriaList((prev) => prev.filter((item) => item.id !== id));
          if (editandoGaleriaId === id) resetFormularios();
        },
      },
    ]);
  };

  // --- ACCIONES EVENTOS ---
  const guardarEvento = () => {
    if (!formEvento.titulo.trim() || !formEvento.fecha.trim()) {
      Alert.alert('Error', 'Por favor completa el nombre y la fecha del evento.');
      return;
    }

    const eventoPayload = {
      titulo: formEvento.titulo,
      tipo: formEvento.tipo,
      fecha: formEvento.fecha,
      hora: formEvento.hora,
      lugar: formEvento.lugar,
      categorias: formEvento.categoriasSel,
    };

    if (editandoEventoId) {
      if (editarEvento) {
        editarEvento(editandoEventoId, eventoPayload);
      }
      Alert.alert('Éxito', `El evento "${formEvento.titulo}" ha sido actualizado.`);
    } else {
      agregarEvento(eventoPayload);
      Alert.alert('Éxito', `El evento "${formEvento.titulo}" ha sido guardado.`);
    }

    resetFormularios();
  };

  const prepararEdicionEvento = (ev) => {
    setEditandoEventoId(ev.id);
    setFormEvento({
      titulo: ev.titulo,
      tipo: ev.tipo || 'Entrenamiento',
      fecha: ev.fecha,
      hora: ev.hora || '17:00 hrs',
      lugar: ev.lugar || 'Cancha Principal Rodelindo',
      categoriasSel: ev.categorias || ['Sub-12'],
    });
    setMostrarFormulario(true);
  };

  const toggleCategoriaEventoForm = (cat) => {
    setFormEvento((prev) => {
      const existe = prev.categoriasSel.includes(cat);
      if (existe) {
        if (prev.categoriasSel.length === 1) return prev;
        return { ...prev, categoriasSel: prev.categoriasSel.filter((c) => c !== cat) };
      }
      return { ...prev, categoriasSel: [...prev.categoriasSel, cat] };
    });
  };

  // FILTRADO DE LISTAS
  const noticiasFiltradas = noticiasList.filter(
    (item) =>
      item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.resumen.toLowerCase().includes(busqueda.toLowerCase())
  );

  const galeriaFiltrada = galeriaList.filter(
    (item) => item.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eventosFiltrados = eventos.filter((ev) => {
    const coincideTexto =
      ev.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (ev.lugar && ev.lugar.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideCategoria =
      filtroCatEvento === 'Todas' ||
      (ev.categorias && ev.categorias.includes(filtroCatEvento));

    return coincideTexto && coincideCategoria;
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
        
        {/* Header Volver */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface1 }]} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.textPrim }}>← Volver al inicio</Text>
          </TouchableOpacity>
        </View>

        <ScreenHeader title="Módulo de Publicación" subtitle="Gestión de Anuncios, Galería y Calendario" />

        <View style={styles.inner}>

          {/* Selector de Pestaña Principal */}
          <View style={[styles.tabSelector, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.tabBtn, tabActual === 'noticia' && { backgroundColor: theme.accentDark }]}
              onPress={() => { setTabActual('noticia'); resetFormularios(); }}
            >
              <Text style={[styles.tabText, { color: tabActual === 'noticia' ? '#fff' : theme.textSec, fontSize: fs(11) }]}>
                📰 Noticias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, tabActual === 'galeria' && { backgroundColor: theme.accentDark }]}
              onPress={() => { setTabActual('galeria'); resetFormularios(); }}
            >
              <Text style={[styles.tabText, { color: tabActual === 'galeria' ? '#fff' : theme.textSec, fontSize: fs(11) }]}>
                🖼️ Galería
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, tabActual === 'evento' && { backgroundColor: theme.accentDark }]}
              onPress={() => { setTabActual('evento'); resetFormularios(); }}
            >
              <Text style={[styles.tabText, { color: tabActual === 'evento' ? '#fff' : theme.textSec, fontSize: fs(11) }]}>
                📅 Eventos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Barra de Búsqueda Universal */}
          <View style={[styles.searchBox, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.textPrim }]}
              placeholder={`Buscar en ${tabActual}...`}
              placeholderTextColor={theme.textMuted}
              value={busqueda}
              onChangeText={setBusqueda}
            />
            {busqueda !== '' && (
              <TouchableOpacity onPress={() => setBusqueda('')}>
                <Text style={{ color: theme.textSec, fontSize: 14, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botón de Despliegue para Formulario de Creación */}
          {!mostrarFormulario && (
            <TouchableOpacity
              style={[styles.toggleFormBtn, { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
              onPress={() => setMostrarFormulario(true)}
            >
              <Text style={styles.toggleFormBtnText}>
                ➕ {tabActual === 'noticia' ? 'Añadir Nueva Noticia' : tabActual === 'galeria' ? 'Añadir Fotos a Galería' : 'Programar Nuevo Evento'}
              </Text>
            </TouchableOpacity>
          )}

          {/* ----------------- FORMULARIO NOTICIA ----------------- */}
          {tabActual === 'noticia' && mostrarFormulario && (
            <View style={[styles.cardForm, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                  {editandoNoticiaId ? '✏️ Editar Noticia' : '📢 Redactar Nueva Noticia'}
                </Text>
                <TouchableOpacity onPress={resetFormularios}>
                  <Text style={{ color: '#FF5A5F', fontWeight: 'bold', fontSize: 13 }}>Cerrar ✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Título de la Noticia</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formNoticia.titulo}
                onChangeText={(t) => setFormNoticia((p) => ({ ...p, titulo: t }))}
                placeholder="Ej: Gran Torneo de Clausura 2026"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Categoría del Anuncio</Text>
              <View style={styles.chipsRow}>
                {['General', 'Institucional', 'Deportiva'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border }, formNoticia.categoria === cat && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                    onPress={() => setFormNoticia((p) => ({ ...p, categoria: cat }))}
                  >
                    <Text style={{ color: formNoticia.categoria === cat ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Resumen Corto</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formNoticia.resumen}
                onChangeText={(t) => setFormNoticia((p) => ({ ...p, resumen: t }))}
                placeholder="Breve introducción..."
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Contenido Completo</Text>
              <TextInput
                style={[styles.inputArea, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formNoticia.contenido}
                onChangeText={(t) => setFormNoticia((p) => ({ ...p, contenido: t }))}
                multiline
                numberOfLines={4}
                placeholder="Detalles del anuncio..."
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Imagen de Portada</Text>
              <TouchableOpacity
                style={[styles.pickImageBtn, { backgroundColor: theme.bg, borderColor: theme.accent }]}
                onPress={() => seleccionarFotoTelefono((uri) => setFormNoticia((p) => ({ ...p, imagen: uri })))}
              >
                <Text style={{ color: theme.accent, fontWeight: 'bold', fontSize: 13 }}>📱 Subir Foto desde el Teléfono</Text>
              </TouchableOpacity>

              <Text style={[styles.orText, { color: theme.textMuted }]}>— o ingresa una URL —</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formNoticia.imagen}
                onChangeText={(t) => setFormNoticia((p) => ({ ...p, imagen: t }))}
                placeholder="https://o-google-drive-link.com/imagen.jpg"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />

              {formNoticia.imagen !== '' && (
                <View style={styles.previewBox}>
                  <Text style={[styles.label, { color: theme.textSec }]}>Vista Previa:</Text>
                  <Image source={{ uri: formNoticia.imagen }} style={styles.previewImage} resizeMode="cover" />
                </View>
              )}

              <TouchableOpacity style={styles.submitBtn} onPress={guardarNoticia}>
                <Text style={styles.submitBtnText}>
                  {editandoNoticiaId ? 'Guardar Cambios ✏️' : 'Publicar Noticia 📢'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ----------------- FORMULARIO GALERÍA ----------------- */}
          {tabActual === 'galeria' && mostrarFormulario && (
            <View style={[styles.cardForm, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                  {editandoGaleriaId ? '✏️ Editar Foto' : '🖼️ Subir Foto a Galería'}
                </Text>
                <TouchableOpacity onPress={resetFormularios}>
                  <Text style={{ color: '#FF5A5F', fontWeight: 'bold', fontSize: 13 }}>Cerrar ✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Título o Descripción</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formGaleria.titulo}
                onChangeText={(t) => setFormGaleria((p) => ({ ...p, titulo: t }))}
                placeholder="Ej: Entrenamiento Sub-12 Cancha 1"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Categoría</Text>
              <View style={styles.chipsRow}>
                {['Entrenamientos', 'Partidos', 'Eventos', 'Institucional'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border }, formGaleria.categoria === cat && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                    onPress={() => setFormGaleria((p) => ({ ...p, categoria: cat }))}
                  >
                    <Text style={{ color: formGaleria.categoria === cat ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Fotografía</Text>
              <TouchableOpacity
                style={[styles.pickImageBtn, { backgroundColor: theme.bg, borderColor: theme.accent }]}
                onPress={() => seleccionarFotoTelefono((uri) => setFormGaleria((p) => ({ ...p, imagen: uri })))}
              >
                <Text style={{ color: theme.accent, fontWeight: 'bold', fontSize: 13 }}>📱 Subir Foto desde el Teléfono</Text>
              </TouchableOpacity>

              <Text style={[styles.orText, { color: theme.textMuted }]}>— o ingresa una URL —</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formGaleria.imagen}
                onChangeText={(t) => setFormGaleria((p) => ({ ...p, imagen: t }))}
                placeholder="https://o-google-drive-link.com/foto.jpg"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />

              {formGaleria.imagen !== '' && (
                <View style={styles.previewBox}>
                  <Text style={[styles.label, { color: theme.textSec }]}>Vista Previa:</Text>
                  <Image source={{ uri: formGaleria.imagen }} style={styles.previewImage} resizeMode="cover" />
                </View>
              )}

              <TouchableOpacity style={styles.submitBtn} onPress={guardarGaleria}>
                <Text style={styles.submitBtnText}>
                  {editandoGaleriaId ? 'Guardar Cambios ✏️' : 'Añadir a Galería 🖼️'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ----------------- FORMULARIO EVENTO ----------------- */}
          {tabActual === 'evento' && mostrarFormulario && (
            <View style={[styles.cardForm, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                  {editandoEventoId ? '✏️ Editar Evento' : '📅 Programar Evento'}
                </Text>
                <TouchableOpacity onPress={resetFormularios}>
                  <Text style={{ color: '#FF5A5F', fontWeight: 'bold', fontSize: 13 }}>Cerrar ✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Nombre del Evento</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formEvento.titulo}
                onChangeText={(t) => setFormEvento((p) => ({ ...p, titulo: t }))}
                placeholder="Ej: Partido Oficial vs. U. de Concepción"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Tipo de Evento</Text>
              <View style={styles.chipsRow}>
                {['Entrenamiento', 'Partido', 'Torneo', 'Reunión'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border }, formEvento.tipo === tipo && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                    onPress={() => setFormEvento((p) => ({ ...p, tipo }))}
                  >
                    <Text style={{ color: formEvento.tipo === tipo ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: theme.textSec }]}>Fecha (AAAA-MM-DD)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                    value={formEvento.fecha}
                    onChangeText={(t) => setFormEvento((p) => ({ ...p, fecha: t }))}
                    placeholder="2026-11-15"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: theme.textSec }]}>Horario</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                    value={formEvento.hora}
                    onChangeText={(t) => setFormEvento((p) => ({ ...p, hora: t }))}
                    placeholder="17:00 hrs"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: theme.textSec }]}>Ubicación / Lugar</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.textPrim, borderColor: theme.border }]}
                value={formEvento.lugar}
                onChangeText={(t) => setFormEvento((p) => ({ ...p, lugar: t }))}
                placeholder="Ej: Complejo Deportivo Rodelindo"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSec }]}>Categorías Convocadas</Text>
              <View style={styles.chipsRow}>
                {LISTA_CATEGORIAS.map((cat) => {
                  const sel = formEvento.categoriasSel.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, { backgroundColor: theme.bg, borderColor: theme.border }, sel && { backgroundColor: theme.accentDark, borderColor: theme.accent }]}
                      onPress={() => toggleCategoriaEventoForm(cat)}
                    >
                      <Text style={{ color: sel ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={guardarEvento}>
                <Text style={styles.submitBtnText}>
                  {editandoEventoId ? 'Guardar Cambios ✏️' : 'Guardar Evento en Calendario 📅'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ----------------- HISTÓRICO DE NOTICIAS ----------------- */}
          {tabActual === 'noticia' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                Histórico de Noticias ({noticiasFiltradas.length})
              </Text>

              {noticiasFiltradas.map((item) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                  <Image source={{ uri: item.imagen }} style={styles.itemThumb} resizeMode="cover" />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.itemTitle, { color: theme.textPrim, fontSize: fs(14) }]}>{item.titulo}</Text>
                    <Text style={{ color: theme.textSec, fontSize: 11 }}>{item.fecha} · {item.categoria}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={2}>{item.resumen}</Text>

                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(90,150,255,0.15)' }]}
                        onPress={() => prepararEdicionNoticia(item)}
                      >
                        <Text style={{ color: '#5A96FF', fontSize: 12, fontWeight: 'bold' }}>Editar ✏️</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(255,90,95,0.15)' }]}
                        onPress={() => eliminarNoticia(item.id)}
                      >
                        <Text style={{ color: '#FF5A5F', fontSize: 12, fontWeight: 'bold' }}>Eliminar 🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ----------------- HISTÓRICO DE GALERÍA ----------------- */}
          {tabActual === 'galeria' && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                Histórico de Fotos ({galeriaFiltrada.length})
              </Text>

              {galeriaFiltrada.map((item) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                  <Image source={{ uri: item.imagen }} style={styles.itemThumb} resizeMode="cover" />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.itemTitle, { color: theme.textPrim, fontSize: fs(14) }]}>{item.titulo}</Text>
                    <Text style={{ color: theme.textSec, fontSize: 11 }}>{item.fecha} · {item.categoria}</Text>

                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(90,150,255,0.15)' }]}
                        onPress={() => prepararEdicionGaleria(item)}
                      >
                        <Text style={{ color: '#5A96FF', fontSize: 12, fontWeight: 'bold' }}>Editar ✏️</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(255,90,95,0.15)' }]}
                        onPress={() => eliminarGaleria(item.id)}
                      >
                        <Text style={{ color: '#FF5A5F', fontSize: 12, fontWeight: 'bold' }}>Eliminar 🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ----------------- HISTÓRICO DE EVENTOS ----------------- */}
          {tabActual === 'evento' && (
            <>
              {/* Filtro por Categorías de Eventos */}
              <View style={styles.catFilterRow}>
                <Text style={[styles.label, { color: theme.textSec, marginTop: 0 }]}>Filtrar por Categoría:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {['Todas', ...LISTA_CATEGORIAS].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        { backgroundColor: theme.surface1, borderColor: theme.border },
                        filtroCatEvento === cat && { backgroundColor: theme.accentDark, borderColor: theme.accent }
                      ]}
                      onPress={() => setFiltroCatEvento(cat)}
                    >
                      <Text style={{ color: filtroCatEvento === cat ? '#fff' : theme.textSec, fontSize: 11, fontWeight: 'bold' }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
                Eventos Guardados en Calendario ({eventosFiltrados.length})
              </Text>

              {eventosFiltrados.map((ev) => (
                <View key={ev.id} style={[styles.itemCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.itemTitle, { color: theme.textPrim, fontSize: fs(14) }]}>{ev.titulo}</Text>
                    <Text style={{ color: theme.accent, fontSize: 12, fontWeight: 'bold' }}>📅 {ev.fecha} · {ev.hora}</Text>
                    <Text style={{ color: theme.textSec, fontSize: 11 }}>📍 {ev.lugar} · {ev.tipo}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11 }}>
                      Categorías: {ev.categorias ? ev.categorias.join(', ') : 'Todas'}
                    </Text>

                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(90,150,255,0.15)' }]}
                        onPress={() => prepararEdicionEvento(ev)}
                      >
                        <Text style={{ color: '#5A96FF', fontSize: 12, fontWeight: 'bold' }}>Editar ✏️</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(255,90,95,0.15)' }]}
                        onPress={() => {
                          Alert.alert('Eliminar Evento', `¿Deseas eliminar el evento "${ev.titulo}"?`, [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Eliminar', style: 'destructive', onPress: () => eliminarEvento(ev.id) },
                          ]);
                        }}
                      >
                        <Text style={{ color: '#FF5A5F', fontSize: 12, fontWeight: 'bold' }}>Eliminar 🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  tabSelector: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabText: { fontWeight: 'bold' },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  toggleFormBtn: { paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  toggleFormBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  cardForm: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 10 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  formTitle: { fontWeight: 'bold' },
  label: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  input: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  inputArea: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, textAlignVertical: 'top', minHeight: 80 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 2 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  pickImageBtn: { paddingVertical: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center', marginVertical: 4 },
  orText: { textAlign: 'center', fontSize: 11, marginVertical: 2 },
  previewBox: { marginTop: 6, gap: 4 },
  previewImage: { width: '100%', height: 140, borderRadius: 8 },
  submitBtn: { backgroundColor: '#3DDC84', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#0B0F14', fontWeight: 'bold', fontSize: 14 },
  catFilterRow: { gap: 6, marginTop: 4 },
  sectionTitle: { fontWeight: 'bold', marginTop: 8 },
  itemCard: { flexDirection: 'row', padding: 12, borderRadius: 10, borderWidth: 1, gap: 12, alignItems: 'center' },
  itemThumb: { width: 70, height: 70, borderRadius: 8 },
  itemTitle: { fontWeight: 'bold' },
  itemActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
});