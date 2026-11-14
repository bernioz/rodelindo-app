import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { MESES, celdasMes, keyDe } from '../../../utils/fechas';

function MiniMes({ anio, mesIdx, hoy, conEventos, onPress, theme }) {
  const celdas = celdasMes(anio, mesIdx);
  const esMesActual = hoy.startsWith(`${anio}-${String(mesIdx + 1).padStart(2, '0')}`);

  return (
    <TouchableOpacity style={styles.mini} activeOpacity={0.7} onPress={onPress}>
      <Text style={[styles.miniTitulo, { color: esMesActual ? theme.accent : theme.textPrim }]}>
        {MESES[mesIdx]}
      </Text>
      <View style={styles.miniGrilla}>
        {celdas.map((d, i) => {
          if (d === null) return <View key={`v${i}`} style={styles.miniCelda} />;
          const key = keyDe(anio, mesIdx, d);
          const esHoy = key === hoy;
          const tiene = conEventos.has(key);
          return (
            <View key={key} style={styles.miniCelda}>
              <View style={[styles.miniDia, esHoy && { backgroundColor: theme.accent }]}>
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: esHoy || tiene ? 'bold' : 'normal',
                    color: esHoy ? '#0B0F14' : tiene ? theme.accent : theme.textSec,
                  }}
                >
                  {d}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

export default function VistaAnio({ anio, hoy, conEventos, onMes }) {
  const { theme, fontSize } = useTheme();
  return (
    <View>
      <View style={styles.grid}>
        {MESES.map((_, mesIdx) => (
          <MiniMes
            key={mesIdx}
            anio={anio}
            mesIdx={mesIdx}
            hoy={hoy}
            conEventos={conEventos}
            theme={theme}
            onPress={() => onMes(mesIdx)}
          />
        ))}
      </View>
      <Text style={[styles.ayuda, { color: theme.textMuted, fontSize: 11 * fontSize }]}>
        Toca un mes para verlo · los días en verde tienen eventos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  mini: { width: '33.3333%', paddingHorizontal: 6, paddingVertical: 8 },
  miniTitulo: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  miniGrilla: { flexDirection: 'row', flexWrap: 'wrap' },
  miniCelda: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 1 },
  miniDia: { width: 13, height: 13, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  ayuda: { textAlign: 'center', marginTop: 12 },
});
