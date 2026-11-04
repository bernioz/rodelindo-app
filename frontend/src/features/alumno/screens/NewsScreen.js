import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import ScreenHeader from '../../../components/ScreenHeader';

const NOTICIAS_MOCK = [
  {
    id: 1,
    titulo: 'Gran Torneo de Primavera Concepción 2026',
    fecha: '24 Oct 2026',
    categoria: 'General',
    resumen: 'Este fin de semana nuestras categorías Sub-10 y Sub-12 disputarán la fase final del torneo local.',
    contenido: 'Los partidos se llevarán a cabo en la cancha principal a partir de las 09:00 hrs. Invitamos a toda la familia de Rodelindo Román a apoyar a nuestros alumnos.',
    imagen: 'https://via.placeholder.com/400x200/1A6B3A/FFFFFF?text=Torneo+Rodelindo'
  },
  {
    id: 2,
    titulo: 'Renovación de Equipamiento Deportivo',
    fecha: '18 Oct 2026',
    categoria: 'Institucional',
    resumen: 'Llegaron los nuevos balones y conos para los entrenamientos de todas las categorías.',
    contenido: 'Agradecemos las gestiones de la directiva. Recordamos a los alumnos cuidar el material de la escuela durante cada sesión.',
    imagen: 'https://via.placeholder.com/400x200/0B0F14/FFFFFF?text=Nuevos+Equipos'
  }
];

export default function NewsScreen() {
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Noticias" subtitle="FC Rodelindo Román · Concepción" />

      <View style={styles.inner}>
        {NOTICIAS_MOCK.map((noticia) => (
          <View key={noticia.id} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <View style={[styles.badge, { backgroundColor: theme.accentDark }]}>
              <Text style={[styles.badgeText, { fontSize: fs(10) }]}>{noticia.categoria.toUpperCase()}</Text>
            </View>
            <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(16) }]}>{noticia.titulo}</Text>
            <Text style={[styles.fecha, { color: theme.textSec, fontSize: fs(11) }]}>{noticia.fecha}</Text>
            <Text style={[styles.resumen, { color: theme.textSec, fontSize: fs(13) }]}>{noticia.resumen}</Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.contenido, { color: theme.textPrim, fontSize: fs(13) }]}>{noticia.contenido}</Text>
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
  card: { borderRadius: 14, padding: 16, borderWidth: 1 },
  badge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginBottom: 8 },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  titulo: { fontWeight: 'bold', marginBottom: 4 },
  fecha: { marginBottom: 10 },
  resumen: { lineHeight: 18, marginBottom: 12 },
  divider: { height: 1, marginBottom: 12 },
  contenido: { lineHeight: 19 },
});