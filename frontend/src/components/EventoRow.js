import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLOR_TIPO, tituloEvento, detalleEvento } from '../utils/eventos';
import { fromKey, MESES } from '../utils/fechas';

// badge: 'hora' muestra la hora, 'fecha' muestra día y mes
export default function EventoRow({ ev, onPress, badge = 'hora', destacado = false }) {
  const { theme, fontSize } = useTheme();
  const color = COLOR_TIPO[ev.tipo] ?? COLOR_TIPO.Otro;
  const d = fromKey(ev.fecha);
  const detalle = detalleEvento(ev);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      style={[
        styles.row,
        { backgroundColor: theme.surface1 },
        destacado && { borderWidth: 1, borderColor: color },
      ]}
    >
      <View style={[styles.badge, { backgroundColor: color }]}>
        {badge === 'fecha' ? (
          <>
            <Text style={[styles.badgeGrande, { fontSize: 16 * fontSize }]}>{d.getDate()}</Text>
            <Text style={[styles.badgeChico, { fontSize: 9 * fontSize }]}>
              {MESES[d.getMonth()].slice(0, 3).toUpperCase()}
            </Text>
          </>
        ) : (
          <Text style={[styles.badgeHora, { fontSize: 12 * fontSize }]}>{ev.hora || '·'}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.titulo, { color: theme.textPrim, fontSize: 14 * fontSize }]}>
          {tituloEvento(ev)}
        </Text>
        {detalle ? (
          <Text style={[styles.detalle, { color: theme.textSec, fontSize: 12 * fontSize }]}>
            {detalle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.tag, { backgroundColor: `${color}22` }]}>
        <Text style={[styles.tagTxt, { color, fontSize: 11 * fontSize }]}>{ev.tipo}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 12, marginBottom: 8, gap: 12 },
  badge: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeGrande: { color: '#0B0F14', fontWeight: 'bold' },
  badgeChico: { color: '#0B0F14', fontWeight: 'bold' },
  badgeHora: { color: '#0B0F14', fontWeight: 'bold' },
  info: { flex: 1 },
  titulo: { fontWeight: '600' },
  detalle: { marginTop: 2 },
  tag: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  tagTxt: { fontWeight: 'bold' },
});
