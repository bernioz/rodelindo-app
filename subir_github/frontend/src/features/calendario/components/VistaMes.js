import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useEventos } from '../../../context/EventosContext';
import EventoRow from '../../../components/EventoRow';
import { COLOR_TIPO, TIPOS } from '../../../utils/eventos';
import { DIAS_CORTOS, celdasMes, keyDe, diasEnMes } from '../../../utils/fechas';

export default function VistaMes({ anio, mesIdx, hoy, seleccion, categoria, onDia }) {
  const { theme, fontSize } = useTheme();
  const { getEventosRango } = useEventos();

  const desde = keyDe(anio, mesIdx, 1);
  const hasta = keyDe(anio, mesIdx, diasEnMes(anio, mesIdx));
  const eventosMes = getEventosRango(desde, hasta, categoria);

  // Tipos de evento presentes en cada día (para los puntos de colores)
  const tiposPorDia = {};
  eventosMes.forEach((e) => {
    (tiposPorDia[e.fecha] = tiposPorDia[e.fecha] || new Set()).add(e.tipo);
  });

  const celdas = celdasMes(anio, mesIdx);
  // Las clases se ven por los puntos y en el detalle del día; la agenda lista lo demás
  const agenda = eventosMes.filter((e) => e.tipo !== 'Clase');

  return (
    <View>
      <View style={[styles.card, { backgroundColor: theme.surface1 }]}>
        <View style={styles.fila}>
          {DIAS_CORTOS.map((d) => (
            <View key={d} style={styles.celda}>
              <Text style={[styles.cabecera, { color: theme.textMuted, fontSize: 11 * fontSize }]}>
                {d.slice(0, 3)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.grilla}>
          {celdas.map((d, i) => {
            if (d === null) return <View key={`v${i}`} style={styles.celda} />;
            const key = keyDe(anio, mesIdx, d);
            const esHoy = key === hoy;
            const esSel = key === seleccion;
            const tipos = TIPOS.filter((t) => tiposPorDia[key]?.has(t));
            return (
              <TouchableOpacity
                key={key}
                style={styles.celda}
                activeOpacity={0.6}
                onPress={() => onDia(key)}
              >
                <View
                  style={[
                    styles.numero,
                    esHoy && { backgroundColor: theme.accent },
                    esSel && !esHoy && { borderWidth: 2, borderColor: theme.textPrim },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14 * fontSize,
                      fontWeight: esHoy ? 'bold' : '500',
                      color: esHoy ? '#0B0F14' : theme.textPrim,
                    }}
                  >
                    {d}
                  </Text>
                </View>
                <View style={styles.puntos}>
                  {tipos.map((t) => (
                    <View key={t} style={[styles.punto, { backgroundColor: COLOR_TIPO[t] }]} />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.leyenda}>
          {TIPOS.map((t) => (
            <View key={t} style={styles.leyItem}>
              <View style={[styles.punto, { backgroundColor: COLOR_TIPO[t] }]} />
              <Text style={{ color: theme.textSec, fontSize: 10 * fontSize }}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[styles.seccion, { color: theme.textPrim, fontSize: 16 * fontSize }]}>
        Torneos y eventos del mes
      </Text>
      {agenda.length === 0 ? (
        <Text style={{ color: theme.textMuted, fontSize: 13 * fontSize }}>
          No hay torneos ni reuniones este mes. Toca un día para ver sus clases.
        </Text>
      ) : (
        agenda.map((ev) => (
          <EventoRow key={ev.id} ev={ev} badge="fecha" onPress={() => onDia(ev.fecha)} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 10, marginBottom: 20 },
  fila: { flexDirection: 'row' },
  grilla: { flexDirection: 'row', flexWrap: 'wrap' },
  celda: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4, minHeight: 50 },
  cabecera: { fontWeight: '600', marginBottom: 2 },
  numero: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  puntos: { flexDirection: 'row', gap: 3, marginTop: 3, height: 6 },
  punto: { width: 6, height: 6, borderRadius: 3 },
  leyenda: { flexDirection: 'row', gap: 14, marginTop: 10, justifyContent: 'center', flexWrap: 'wrap' },
  leyItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  seccion: { fontWeight: 'bold', marginBottom: 10 },
});
