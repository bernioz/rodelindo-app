import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import ScreenHeader from '../../../components/ScreenHeader';

export default function AdminHomeScreen({ navigation }) {
  const { logout } = useAuth();
  const { theme, fontSize } = useTheme();
  const fs = (s) => s * fontSize;

  const MODULOS = [
    { id: 1, titulo: 'Gestión de Usuarios', desc: 'Alumnos, Apoderados y Profesores', icono: '👥', color: 'rgba(61,220,132,0.15)', screen: 'AdminUsuarios' },
    { id: 2, titulo: 'Panel Financiero', desc: 'Control de matrículas y mensualidades', icono: '💳', color: 'rgba(245,166,35,0.15)', screen: 'AdminFinanzas' },
    { id: 3, titulo: 'Categorías y Series', desc: 'Asignación de alumnos y entrenadores', icono: '⚽', color: 'rgba(90,150,255,0.15)', screen: 'AdminCategorias' },
    { id: 4, titulo: 'Noticias y Galería', desc: 'Publicar anuncios, fotos y eventos', icono: '📢', color: 'rgba(180,90,255,0.15)', screen: 'AdminPublicaciones' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Panel Director" subtitle="FC Rodelindo Román · Administración" />

      <View style={styles.inner}>
        {/* Banner de bienvenida */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <Text style={[styles.welcomeTitle, { color: theme.textPrim, fontSize: fs(18) }]}>
            Bienvenido, Sebastián Varela 👋
          </Text>
          <Text style={[styles.welcomeSub, { color: theme.textSec, fontSize: fs(13) }]}>
            Centro de control y gestión global de la escuela de fútbol.
          </Text>
        </View>

        {/* Módulos Principales */}
        <Text style={[styles.sectionTitle, { color: theme.textPrim, fontSize: fs(16) }]}>
          Módulos del Sistema
        </Text>

        <View style={styles.grid}>
          {MODULOS.map((mod) => (
            <TouchableOpacity 
              key={mod.id} 
              style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.border }]}
              activeOpacity={0.7}
              onPress={() => mod.screen && navigation.navigate(mod.screen)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: mod.color }]}>
                <Text style={{ fontSize: 24 }}>{mod.icono}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.textPrim, fontSize: fs(15) }]}>
                  {mod.titulo}
                </Text>
                <Text style={[styles.cardDesc, { color: theme.textSec, fontSize: fs(11) }]}>
                  {mod.desc}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: theme.surface1, borderColor: '#FF5A5F' }]} 
          onPress={logout}
        >
          <Text style={[styles.logoutText, { fontSize: fs(15) }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  inner: { padding: 20, gap: 16 },
  welcomeCard: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 4 },
  welcomeTitle: { fontWeight: 'bold' },
  welcomeSub: {},
  sectionTitle: { fontWeight: 'bold', marginTop: 8 },
  grid: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, gap: 14 },
  iconWrapper: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontWeight: 'bold', marginBottom: 2 },
  cardDesc: {},
  logoutBtn: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  logoutText: { color: '#FF5A5F', fontWeight: 'bold' },
});