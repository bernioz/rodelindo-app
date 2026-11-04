import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useEventos } from '../context/EventosContext';
import {
  TIPOS, CATEGORIAS, DIRIGIDO_A, COLOR_TIPO, CAMPOS_POR_TIPO,
  etiquetaCampo, eventoVacio, validarEvento, limpiarEvento,
} from '../utils/eventos';
import { addDias, formatLargo } from '../utils/fechas';

// evento = null → crear uno nuevo | evento = {...} → editar
export default function EventoModal({ visible, onClose, fechaInicial, evento = null }) {
  const { theme, fontSize } = useTheme();
  const { agregarEvento, editarEvento, eliminarEvento } = useEventos();

  const [draft, setDraft] = useState(eventoVacio());
  const [fecha, setFecha] = useState(fechaInicial);
  const [errores, setErrores] = useState({});

  // Cada vez que se abre, parte desde cero o desde el evento a editar
  useEffect(() => {
    if (!visible) return;
    if (evento) {
      setDraft({ ...eventoVacio(), ...evento });
      setFecha(evento.fecha);
    } else {
      setDraft(eventoVacio());
      setFecha(fechaInicial);
    }
    setErrores({});
  }, [visible, evento, fechaInicial]);

  const campos = CAMPOS_POR_TIPO[draft.tipo];
  const set = (k, v) => {
    setDraft((p) => ({ ...p, [k]: v }));
    setErrores((p) => ({ ...p, [k]: undefined }));
  };

  const cambiarTipo = (tipo) => {
    setDraft((p) => ({
      ...p,
      tipo,
      // Una clase necesita una categoría concreta
      categoria: tipo === 'Clase' && p.categoria === 'Todas' ? 'Sub-12' : p.categoria,
    }));
    setErrores({});
  };

  const guardar = () => {
    const err = validarEvento(draft);
    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }
    const datos = limpiarEvento({ ...draft, fecha });
    if (evento) editarEvento(evento.id, datos);
    else agregarEvento(datos);
    onClose();
  };

  const borrar = () => {
    eliminarEvento(evento.id);
    onClose();
  };

  const fs = (s) => s * fontSize;

  const Chip = ({ label, activo, onPress, color }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: theme.bg, borderColor: theme.border },
        activo && { backgroundColor: color ?? theme.accentDark, borderColor: color ?? theme.accentDark },
      ]}
    >
      <Text style={{ fontSize: fs(13), color: activo ? '#0B0F14' : theme.textSec, fontWeight: activo ? 'bold' : '500' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCampo = (campo) => {
    const etiqueta = etiquetaCampo(draft.tipo, campo);

    if (campo === 'categoria') {
      const opciones = draft.tipo === 'Clase' ? CATEGORIAS : ['Todas', ...CATEGORIAS];
      return (
        <View key={campo}>
          <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>{etiqueta}</Text>
          <View style={styles.chips}>
            {opciones.map((c) => (
              <Chip key={c} label={c} activo={draft.categoria === c} onPress={() => set('categoria', c)} />
            ))}
          </View>
          {errores.categoria ? <Text style={styles.error}>{errores.categoria}</Text> : null}
        </View>
      );
    }

    if (campo === 'dirigidoA') {
      return (
        <View key={campo}>
          <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>{etiqueta}</Text>
          <View style={styles.chips}>
            {DIRIGIDO_A.map((c) => (
              <Chip key={c} label={c} activo={draft.dirigidoA === c} onPress={() => set('dirigidoA', c)} />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View key={campo}>
        <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>{etiqueta}</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.bg, color: theme.textPrim, fontSize: fs(15),
              borderColor: errores[campo] ? '#FF5A5F' : theme.border },
            campo === 'notas' && { minHeight: 70, textAlignVertical: 'top' },
          ]}
          value={draft[campo]}
          onChangeText={(t) => set(campo, t)}
          placeholderTextColor={theme.textMuted}
          multiline={campo === 'notas'}
          keyboardType={campo === 'hora' ? 'numbers-and-punctuation' : 'default'}
          placeholder={campo === 'hora' ? '17:30' : ''}
        />
        {errores[campo] ? <Text style={styles.error}>{errores[campo]}</Text> : null}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.card, { backgroundColor: theme.surface1 }]}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(18) }]}>
              {evento ? 'Editar evento' : 'Nuevo evento'}
            </Text>

            {/* Tipo */}
            <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Tipo de evento</Text>
            <View style={styles.chips}>
              {TIPOS.map((t) => (
                <Chip key={t} label={t} activo={draft.tipo === t} color={COLOR_TIPO[t]} onPress={() => cambiarTipo(t)} />
              ))}
            </View>

            {/* Fecha */}
            <Text style={[styles.label, { color: theme.textSec, fontSize: fs(12) }]}>Fecha</Text>
            <View style={[styles.fechaRow, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <TouchableOpacity onPress={() => setFecha(addDias(fecha, -7))} style={styles.fechaBtn}>
                <Text style={[styles.fechaFlecha, { color: theme.accent }]}>«</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFecha(addDias(fecha, -1))} style={styles.fechaBtn}>
                <Text style={[styles.fechaFlecha, { color: theme.accent }]}>‹</Text>
              </TouchableOpacity>
              <Text style={[styles.fechaTxt, { color: theme.textPrim, fontSize: fs(13) }]}>
                {formatLargo(fecha)}
              </Text>
              <TouchableOpacity onPress={() => setFecha(addDias(fecha, 1))} style={styles.fechaBtn}>
                <Text style={[styles.fechaFlecha, { color: theme.accent }]}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFecha(addDias(fecha, 7))} style={styles.fechaBtn}>
                <Text style={[styles.fechaFlecha, { color: theme.accent }]}>»</Text>
              </TouchableOpacity>
            </View>

            {/* Campos que dependen del tipo */}
            {campos.map(renderCampo)}

            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.btnCancelar, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={onClose}
              >
                <Text style={{ color: theme.textSec, fontSize: fs(15) }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: theme.accent }]} onPress={guardar}>
                <Text style={{ color: '#0B0F14', fontSize: fs(15), fontWeight: 'bold' }}>
                  {evento ? 'Guardar cambios' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>

            {evento && (
              <TouchableOpacity style={styles.btnBorrar} onPress={borrar}>
                <Text style={{ color: '#FF5A5F', fontSize: fs(14), fontWeight: 'bold' }}>Eliminar evento</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  card: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36, maxHeight: '90%' },
  titulo: { fontWeight: 'bold', marginBottom: 4 },
  label: { marginTop: 14, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  error: { color: '#FF5A5F', fontSize: 11, marginTop: 4 },
  fechaRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingVertical: 4 },
  fechaBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  fechaFlecha: { fontSize: 22, fontWeight: 'bold' },
  fechaTxt: { flex: 1, textAlign: 'center', fontWeight: '600', textTransform: 'capitalize' },
  botones: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancelar: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1 },
  btnGuardar: { flex: 1.3, borderRadius: 10, padding: 14, alignItems: 'center' },
  btnBorrar: { alignItems: 'center', paddingVertical: 16, marginTop: 6 },
});
