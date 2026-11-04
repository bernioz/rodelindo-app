import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import ScreenHeader from '../../../components/ScreenHeader';

const GALERIA_MOCK = [
  {
    id: 1,
    titulo: 'Entrenamiento Sub-12',
    fecha: '15 Oct 2026',
    categoria: 'Entrenamientos',
    imagen: 'https://via.placeholder.com/600x350/1A6B3A/FFFFFF?text=Entrenamiento+Sub-12',
  },
  {
    id: 2,
    titulo: 'Partido vs. Universidad de Concepción',
    fecha: '10 Oct 2026',
    categoria: 'Partidos',
    imagen: 'https://via.placeholder.com/600x350/0B0F14/FFFFFF?text=Partido+vs+UdeC',
  },
  {
    id: 3,
    titulo: 'Premiación Cierre de Mes',
    fecha: '30 Sep 2026',
    categoria: 'Eventos',
    imagen: 'https://via.placeholder.com/600x350/2B8A4E/FFFFFF?text=Premiacion+Rodelindo',
  },
  {
    id: 4,
    titulo: 'Entrega de Nuevos Uniformes',
    fecha: '20 Sep 2026',
    categoria: 'Institucional',
    imagen: 'https://via.placeholder.com/600x350/111827/FFFFFF?text=Nuevos+Uniformes',
  },
];

export default function GalleryScreen() {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Galería de Fotos" subtitle="FC Rodelindo Román · Concepción" />

      <View style={styles.inner}>
        {GALERIA_MOCK.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} resizeMode="cover" />
            <View style={styles.cardContent}>
              <View style={[styles.badge, { backgroundColor: theme.accentDark }]}>
                <Text style={[styles.badgeText, { fontSize: fs(10) }]}>{item.categoria.toUpperCase()}</Text>
              </View>
              <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(15) }]}>{item.titulo}</Text>
              <Text style={[styles.fecha, { color: theme.textSec, fontSize: fs(11) }]}>{item.fecha}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  inner: { padding: 20, gap: 16 },
  card: { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  imagen: { width: '100%', height: 180 },
  cardContent: { padding: 14 },
  badge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, marginBottom: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  titulo: { fontWeight: 'bold', marginBottom: 2 },
  fecha: {},
});