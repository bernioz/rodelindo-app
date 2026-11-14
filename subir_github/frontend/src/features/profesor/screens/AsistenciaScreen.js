import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import { useEventos } from '../../../context/EventosContext';
import { categorias } from '../../../data/mockData';
import { hoyKey, addDias, formatLargo } from '../../../utils/fechas';
import { esDiaDeClase } from '../../../utils/asistencia';
import { COLOR_TIPO, tituloEvento, detalleEvento } from '../../../utils/eventos';
import ScreenHeader from '../../../components/ScreenHeader';
import Avatar from '../../../components/Avatar';

function ListaAsistencia({ categoria, fechaInicial, onVolver, theme, fontSize }) {
  const navigation = useNavigation();
  const { getByCategoria, getSesion, guardarAsistencia } = useAlumnos();
  const { getEventosDia } = useEventos();
  const hoy = hoyKey();
  const [fecha, setFecha] = useState(fechaInicial ?? hoy);

  // Solo alumnos que ya estaban inscritos ese día
  const alumnos = getByCategoria(categoria).filter((a) => a.fechaIngreso <= fecha);
  const sesion = getSesion(categoria, fecha);
  const eventosDia = getEventosDia(fecha, categoria);

  const [asistencia, setAsistencia] = useState({});

  // Al cambiar de día o categoría, carga lo que ya estaba guardado
  useEffect(() => {
    const s = getSesion(categoria, fecha);
    setAsistencia(
      Object.fromEntries(alumnos.map((a) => [a.id, s ? s.presentes.includes(a.id) : false]))
    );
  }, [fecha, categoria]);

  const toggle = (id) => setAsistencia((prev) => ({ ...prev, [id]: !prev[id] }));
  const presentes = alumnos.filter((a) => asistencia[a.id]).length;
  const total = alumnos.length;

  const guardar = () => {
    const ids = alumnos.filter((a) => asistencia[a.id]).map((a) => a.id);
    guardarAsistencia(categoria, fecha, ids);
    Alert.alert(
      'Asistencia guardada ✓',
      `${presentes} de ${total} presentes en ${categoria}\n${formatLargo(fecha)}.`,
      [{ text: 'OK' }]
    );
  };

  const abrirCalendario = () => navigation.navigate('Calendario', { vista: 'mes', fecha });

  const fs = (s) => s * fontSize;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title={`Asistencia ${categoria}`} subtitle="Registro por clase" />

      <View style={styles.backRow}>
        <TouchableOpacity onPress={onVolver}>
          <Text style={[styles.backText, { color: theme.accent, fontSize: fs(15) }]}>
            ‹ Cambiar categoría
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selector de día: las flechas cambian de día, la fecha abre el calendario */}
      <View style={[styles.fechaCard, { backgroundColor: theme.surface1 }]}>
        <TouchableOpacity onPress={() => setFecha(addDias(fecha, -1))} style={styles.fechaBtn}>
          <Text style={[styles.fechaFlecha, { color: theme.accent }]}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fechaCentro} onPress={abrirCalendario} activeOpacity={0.7}>
          <Text style={[styles.fechaTxt, { color: theme.textPrim, fontSize: fs(14) }]}>
            📅 {formatLargo(fecha)}
          </Text>
          <Text style={{ fontSize: fs(11), color: sesion ? theme.accent : theme.textMuted }}>
            {sesion
              ? 'Asistencia ya registrada ✓'
              : esDiaDeClase(fecha) ? 'Sin registrar' : 'Día sin entrenamiento habitual'}
            {fecha === hoy ? ' · hoy' : ''}
          </Text>
          <Text style={{ fontSize: fs(10), color: theme.textMuted }}>Toca la fecha para ver el calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFecha(addDias(fecha, 1))}
          disabled={fecha >= hoy}
          style={[styles.fechaBtn, fecha >= hoy && { opacity: 0.25 }]}
        >
          <Text style={[styles.fechaFlecha, { color: theme.accent }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Eventos de ese día */}
      {eventosDia.length > 0 && (
        <View style={[styles.eventos, { backgroundColor: theme.surface1 }]}>
          {eventosDia.slice(0, 3).map((ev) => (
            <View key={ev.id} style={styles.eventoLinea}>
              <View style={[styles.eventoPunto, { backgroundColor: COLOR_TIPO[ev.tipo] }]} />
              <Text style={{ color: theme.textSec, fontSize: fs(12), flex: 1 }} numberOfLines={1}>
                {tituloEvento(ev)}{detalleEvento(ev) ? ` · ${detalleEvento(ev)}` : ''}
              </Text>
            </View>
          ))}
          {eventosDia.length > 3 && (
            <Text style={{ color: theme.textMuted, fontSize: fs(11) }}>
              +{eventosDia.length - 3} más
            </Text>
          )}
        </View>
      )}

      {/* Contador */}
      <View style={[styles.counter, { backgroundColor: theme.surface1 }]}>
        <Text>
          <Text style={[styles.counterNum, { color: theme.accent }]}>{presentes}</Text>
          <Text style={[styles.counterOf, { color: theme.textSec }]}> / {total} presentes</Text>
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progressFill, {
            width: total > 0 ? `${(presentes / total) * 100}%` : '0%',
            backgroundColor: theme.accent,
          }]} />
        </View>
      </View>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const presente = !!asistencia[item.id];
          return (
            <TouchableOpacity
              style={[styles.alumnoRow, { backgroundColor: theme.surface1, borderColor: theme.border },
                presente && { borderColor: theme.accentDark, backgroundColor: 'rgba(26,107,58,0.1)' }]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.7}
            >
              <Avatar alumno={item} size={40} highlight={presente} />
              <View style={styles.alumnoInfo}>
                <Text style={[styles.alumnoNombre, { color: theme.textPrim, fontSize: fs(15) }]}>
                  {item.nombre_completo}
                </Text>
                <Text style={[styles.alumnoAsist, { color: theme.textSec, fontSize: fs(12) }]}>
                  {item.asistencia}% histórico
                </Text>
              </View>
              <View style={[styles.checkbox, { borderColor: theme.border },
                presente && { backgroundColor: theme.accentDark, borderColor: theme.accentDark }]}>
                {presente && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.surface1 }]}>
        <TouchableOpacity style={[styles.guardarBtn, { backgroundColor: theme.accent }]} onPress={guardar}>
          <Text style={styles.guardarText}>
            {sesion ? 'Actualizar asistencia' : 'Guardar asistencia'} — {categoria}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AsistenciaScreen({ route }) {
  const { theme, fontSize } = useTheme();
  const { getByCategoria, getSesion } = useAlumnos();
  const params = route?.params;

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [fechaInicial, setFechaInicial] = useState(null);

  // Si llegan desde el calendario (botón Registrar / Editar), abre esa categoría y fecha
  useEffect(() => {
    if (params?.categoria) {
      setCategoriaSeleccionada(params.categoria);
      setFechaInicial(params.fecha ?? null);
    }
  }, [params?.nonce]);

  if (categoriaSeleccionada) {
    return (
      <ListaAsistencia
        key={`${categoriaSeleccionada}-${fechaInicial}-${params?.nonce ?? 0}`}
        categoria={categoriaSeleccionada}
        fechaInicial={fechaInicial}
        onVolver={() => { setCategoriaSeleccionada(null); setFechaInicial(null); }}
        theme={theme}
        fontSize={fontSize}
      />
    );
  }

  const hoy = hoyKey();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Asistencia" subtitle={formatLargo(hoy)} />
      <FlatList
        data={categorias}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.lista}
        renderItem={({ item: cat }) => {
          const n = getByCategoria(cat).length;
          const registradaHoy = !!getSesion(cat, hoy);
          return (
            <TouchableOpacity
              style={[styles.catCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              onPress={() => setCategoriaSeleccionada(cat)}
              activeOpacity={0.75}
            >
              <View style={[styles.catIcon, { backgroundColor: 'rgba(26,107,58,0.2)' }]}>
                <Text style={styles.catIconText}>⚽</Text>
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catNombre, { color: theme.textPrim, fontSize: 17 * fontSize }]}>{cat}</Text>
                <Text style={[styles.catAlumnos, { color: theme.textSec, fontSize: 12 * fontSize }]}>
                  {n} alumnos · {registradaHoy ? 'registrada hoy ✓' : 'sin registrar hoy'}
                </Text>
              </View>
              <Text style={[styles.catArrow, { color: theme.accent }]}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backRow: { paddingHorizontal: 20, paddingTop: 12 },
  backText: {},
  lista: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 12 },
  catCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 10, gap: 14, borderWidth: 1 },
  catIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  catIconText: { fontSize: 20 },
  catInfo: { flex: 1 },
  catNombre: { fontWeight: 'bold' },
  catAlumnos: { marginTop: 2 },
  catArrow: { fontSize: 24 },
  fechaCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 12, borderRadius: 12, padding: 8 },
  fechaBtn: { paddingHorizontal: 14, paddingVertical: 4 },
  fechaFlecha: { fontSize: 28, fontWeight: 'bold' },
  fechaCentro: { flex: 1, alignItems: 'center', gap: 2 },
  fechaTxt: { fontWeight: 'bold', textTransform: 'capitalize' },
  eventos: { marginHorizontal: 20, marginTop: 10, borderRadius: 10, padding: 10, gap: 4 },
  eventoLinea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eventoPunto: { width: 7, height: 7, borderRadius: 4 },
  counter: { marginHorizontal: 20, marginVertical: 12, borderRadius: 12, padding: 16, gap: 10 },
  counterNum: { fontSize: 28, fontWeight: 'bold' },
  counterOf: { fontSize: 16 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  alumnoRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 10, gap: 12, borderWidth: 1 },
  alumnoInfo: { flex: 1 },
  alumnoNombre: { fontWeight: '500' },
  alumnoAsist: { marginTop: 2 },
  checkbox: { width: 26, height: 26, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  guardarBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  guardarText: { color: '#0B0F14', fontSize: 16, fontWeight: 'bold' },
});
