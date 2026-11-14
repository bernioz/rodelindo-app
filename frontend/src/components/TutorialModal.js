import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTutorial } from '../context/TutorialContext';
import { TUTORIAL_POR_ROL } from '../data/tutorialData';

export default function TutorialModal() {
  const { theme, fontSize } = useTheme();
  const { visible, rolActual, cerrarTutorial } = useTutorial();
  const [indice, setIndice] = useState(0);

  const guia = rolActual ? TUTORIAL_POR_ROL[rolActual] : null;
  const pasos = guia?.pasos ?? [];

  useEffect(() => {
    if (visible) {
      setIndice(0);
    }
  }, [visible, rolActual]);

  if (!visible || !guia || pasos.length === 0) return null;

  const paso = pasos[indice] || pasos[0];
  const esPrimero = indice === 0;
  const esUltimo = indice === pasos.length - 1;
  const progreso = ((indice + 1) / pasos.length) * 100;

  const fs = (s) => s * fontSize;

  const siguiente = () => {
    if (esUltimo) cerrarTutorial();
    else setIndice((prev) => prev + 1);
  };

  const anterior = () => {
    if (!esPrimero) setIndice((prev) => prev - 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cerrarTutorial}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>

          {/* Cabecera: Badge de rol + Botón saltar */}
          <View style={styles.topBar}>
            <View style={[styles.roleBadge, { backgroundColor: 'rgba(61,220,132,0.14)' }]}>
              <Text style={[styles.roleBadgeText, { color: theme.accent, fontSize: fs(11) }]}>
                {guia.badge}
              </Text>
            </View>
            <TouchableOpacity onPress={cerrarTutorial} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.skipText, { color: theme.textMuted, fontSize: fs(13) }]}>
                Saltar ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Barra de progreso */}
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progreso}%`, backgroundColor: theme.accent }]} />
          </View>
          <Text style={[styles.stepCounter, { color: theme.textMuted, fontSize: fs(11) }]}>
            Paso {indice + 1} de {pasos.length}
          </Text>

          {/* Contenido del paso */}
          <View style={styles.body}>
            <View style={[styles.iconCircle, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <Text style={styles.iconEmoji}>{paso.icono}</Text>
            </View>

            <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(19) }]}>
              {paso.titulo}
            </Text>

            <Text style={[styles.descripcion, { color: theme.textSec, fontSize: fs(14) }]}>
              {paso.descripcion}
            </Text>

            {paso.tip && (
              <View style={[styles.tipBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Text style={[styles.tipText, { color: theme.textPrim, fontSize: fs(12) }]}>
                  💡 {paso.tip}
                </Text>
              </View>
            )}
          </View>

          {/* Indicadores de puntos */}
          <View style={styles.dotsRow}>
            {pasos.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setIndice(i)}
                style={[
                  styles.dot,
                  { backgroundColor: i === indice ? theme.accent : theme.border },
                  i === indice && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Botones de navegación */}
          <View style={styles.footerBtns}>
            <TouchableOpacity
              onPress={anterior}
              disabled={esPrimero}
              style={[
                styles.btnSec,
                { backgroundColor: theme.bg, borderColor: theme.border },
                esPrimero && { opacity: 0.35 },
              ]}
            >
              <Text style={[styles.btnSecText, { color: theme.textPrim, fontSize: fs(14) }]}>
                ‹ Anterior
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={siguiente}
              style={[styles.btnPrim, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.btnPrimText, { fontSize: fs(14) }]}>
                {esUltimo ? '¡Entendido! ✓' : 'Siguiente ›'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontWeight: 'bold',
  },
  skipText: {
    fontWeight: '600',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepCounter: {
    textAlign: 'right',
    marginTop: 5,
    marginBottom: 8,
  },
  body: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconEmoji: {
    fontSize: 34,
  },
  titulo: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  descripcion: {
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 14,
  },
  tipBox: {
    width: '100%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  tipText: {
    lineHeight: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSec: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnSecText: {
    fontWeight: '600',
  },
  btnPrim: {
    flex: 1.3,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnPrimText: {
    color: '#0B0F14',
    fontWeight: 'bold',
  },
});