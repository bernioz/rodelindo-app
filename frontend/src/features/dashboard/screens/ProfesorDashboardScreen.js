import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export default function ProfesorDashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hola, {user.nombre} 👋</Text>
          <Text style={styles.subtitle}>Panel del Profesor</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      <View style={styles.kpiRow}>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>✅</Text>
          <Text style={styles.actionLabel}>Tomar{'\n'}Asistencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionLabel}>Ver{'\n'}Alumnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>🏆</Text>
          <Text style={styles.actionLabel}>Torneos</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen del día */}
      <Text style={styles.sectionTitle}>Hoy</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>📅 Entrenamiento Sub-12 · 16:00</Text>
        <Text style={styles.infoText}>👦 14 alumnos en lista</Text>
        <Text style={styles.infoText}>📍 Cancha Principal</Text>
      </View>

      {/* Categorías */}
      <Text style={styles.sectionTitle}>Mis categorías</Text>
      {['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'].map((cat) => (
        <TouchableOpacity key={cat} style={styles.catRow}>
          <Text style={styles.catText}>{cat}</Text>
          <Text style={styles.catArrow}>›</Text>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14' },
  content: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  title: { color: '#F5F7FA', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#8A93A3', fontSize: 14, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#151B23',
    borderWidth: 1,
    borderColor: '#2A3341',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: '#8A93A3', fontSize: 13 },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#151B23',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: {
    color: '#F5F7FA',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: '#151B23',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  infoText: { color: '#F5F7FA', fontSize: 14 },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151B23',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  catText: { color: '#F5F7FA', fontSize: 15 },
  catArrow: { color: '#3DDC84', fontSize: 20 },
});
