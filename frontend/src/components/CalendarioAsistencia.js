import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAlumnos } from '../context/AlumnosContext';
import { MESES, DIAS_CORTOS, toKey, hoyKey, formatLargo } from '../utils/fechas';

const VERDE = '#3DDC84';
const ROJO = '#FF5A5F';

export default function CalendarioAsistencia({ alumnoId }) {
  const { theme, fontSize } = useTheme();
  const { getHistorial } = useAlumnos();
  const historial = getHistorial(alumnoId);

  const hoy = hoyKey();
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [seleccion, setSeleccion] = useState(null);

  const anio = mes.getFullYear();
  const mesIdx = mes.getMonth();
  const diasEnMes = new Date(anio, mesIdx + 1, 0).getDate();
  const offset = (new Date(anio, mesIdx, 1).getDay() + 6) % 7; // lunes = 0

  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);

  const keyDe = (d) => toKey(new Date(anio, mesIdx, d));

  // Resumen del mes visible
  let asistio = 0;
  let falto = 0;
  for (let d = 1; d <= diasEnMes; d++) {
    const estado = historial[keyDe(d)];
    if (estado === true) asistio++;
    if (estado === false) falto++;
  }

  const esMesActual = anio === new Date().getFullYear() && mesIdx === new Date().getMonth();
  const cambiarMes = (delta) => {
    setMes(new Date(anio, mesIdx + delta, 1));
    setSeleccion(null);
  };

  const detalle = () => {
    if (!seleccion) return null;
    const estado = historial[seleccion];
    if (estado === true) return { texto: 'Asistió', color: VERDE, icono: '✓' };
    if (estado === false) return { texto: 'Faltó', color: ROJO, icono: '✗' };
    if (seleccion > hoy) return { texto: 'Aún no ocurre', color: theme.textMuted, icono: '–' };
    return { texto: 'Sin clase registrada', color: theme.textMuted, icono: '–' };
  };
  const info = detalle();

  const estiloCelda = (estado) => {
    if (estado === true) return { bg: 'rgba(61,220,132,0.22)', color: VERDE };
    if (estado === false) return { bg: 'rgba(255,90,95,0.22)', color: ROJO };
    return { bg: 'transparent', color: theme.textMuted };
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface1 }]}>
      {/* Navegación de mes */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => cambiarMes(-1)} style={styles.navBtn}>
          <Text style={[styles.navTxt, { color: theme.accent }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.mesTitulo, { color: theme.textPrim, fontSize: 15 * fontSize }]}>
          {MESES[mesIdx]} {anio}
        </Text>
        <TouchableOpacity
          onPress={() => cambiarMes(1)}
          disabled={esMesActual}
          style={[styles.navBtn, esMesActual && { opacity: 0.25 }]}
        >
          <Text style={[styles.navTxt, { color: theme.accent }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Cabecera días */}
      <View style={styles.fila}>
        {DIAS_CORTOS.map((d) => (
          <View key={d} style={styles.celdaBox}>
            <Text style={[styles.diaCab, { color: theme.textMuted, fontSize: 10 * fontSize }]}>
              {d.slice(0, 2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Grilla */}
      <View style={styles.grilla}>
        {celdas.map((d, i) => {
          if (d === null) return <View key={`v${i}`} style={styles.celdaBox} />;
          const key = keyDe(d);
          const { bg, color } = estiloCelda(historial[key]);
          const esHoy = key === hoy;
          const esSel = key === seleccion;
          return (
            <View key={key} style={styles.celdaBox}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSeleccion(esSel ? null : key)}
                style={[
                  styles.celda,
                  { backgroundColor: bg },
                  esHoy && { borderWidth: 1.5, borderColor: theme.accent },
                  esSel && { borderWidth: 2, borderColor: theme.textPrim },
                ]}
              >
                <Text style={[styles.celdaTxt, { color, fontSize: 12 * fontSize }]}>{d}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Detalle del día elegido */}
      {info && (
        <View style={[styles.detalle, { backgroundColor: theme.surface2 }]}>
          <Text style={{ color: theme.textSec, fontSize: 12 * fontSize }}>
            {formatLargo(seleccion)}
          </Text>
          <Text style={{ color: info.color, fontSize: 14 * fontSize, fontWeight: 'bold' }}>
            {info.icono} {info.texto}
          </Text>
        </View>
      )}

      {/* Resumen + leyenda */}
      <View style={styles.resumen}>
        <Text style={{ color: theme.textSec, fontSize: 12 * fontSize }}>
          Este mes: <Text style={{ color: VERDE, fontWeight: 'bold' }}>{asistio} asistidas</Text>
          {'  ·  '}
          <Text style={{ color: ROJO, fontWeight: 'bold' }}>{falto} faltas</Text>
        </Text>
      </View>
      <View style={styles.leyenda}>
        {[
          { c: 'rgba(61,220,132,0.5)', l: 'Asistió' },
          { c: 'rgba(255,90,95,0.5)', l: 'Faltó' },
          { c: theme.surface2, l: 'Sin clase' },
        ].map((x) => (
          <View key={x.l} style={styles.leyItem}>
            <View style={[styles.leyDot, { backgroundColor: x.c }]} />
            <Text style={{ color: theme.textSec, fontSize: 10 * fontSize }}>{x.l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 14, marginBottom: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  navBtn: { paddingHorizontal: 14, paddingVertical: 2 },
  navTxt: { fontSize: 26, fontWeight: 'bold' },
  mesTitulo: { fontWeight: 'bold' },
  fila: { flexDirection: 'row' },
  grilla: { flexDirection: 'row', flexWrap: 'wrap' },
  celdaBox: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 2 },
  diaCab: { fontWeight: '600', marginBottom: 4 },
  celda: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  celdaTxt: { fontWeight: '600' },
  detalle: { borderRadius: 10, padding: 10, marginTop: 10, gap: 2 },
  resumen: { marginTop: 12 },
  leyenda: { flexDirection: 'row', gap: 14, marginTop: 8, flexWrap: 'wrap' },
  leyItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  leyDot: { width: 9, height: 9, borderRadius: 5 },
});
