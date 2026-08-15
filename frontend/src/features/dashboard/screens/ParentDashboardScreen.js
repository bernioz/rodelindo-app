import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ParentDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hola, familia López 👋</Text>
        <Text style={styles.subtitle}>Mateo · Categoría Sub-12</Text>
      </View>

      {/* Alerta de Pago */}
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>⚠️ Pago Pendiente</Text>
        <Text style={styles.alertText}>La mensualidad de Agosto aún no ha sido registrada.</Text>
        <TouchableOpacity style={styles.alertButton}>
          <Text style={styles.alertButtonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs en fila */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Asistencia</Text>
          <Text style={styles.kpiValue}>78%</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Torneos</Text>
          <Text style={styles.kpiValue}>4 Jugados</Text>
        </View>
      </View>

      {/* Próxima Clase */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Clase</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📅 Martes 11 de Agosto, 17:30 hrs</Text>
          <Text style={styles.infoText}>📍 Cancha Principal</Text>
        </View>
      </View>

      {/* Botón Perfil del Jugador */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Ver Ficha Completa del Jugador</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  content: {
    padding: 24,
    paddingTop: 60, // Espacio para la barra de estado/notch del celular
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8A93A3',
    fontSize: 16,
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: 'rgba(245, 166, 35, 0.1)', // Fondo naranjo semitransparente
    borderColor: '#F5A623',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertTitle: {
    color: '#F5A623',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    color: '#F5F7FA',
    fontSize: 14,
    marginBottom: 12,
  },
  alertButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#0B0F14',
    fontWeight: 'bold',
    fontSize: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Separa las tarjetas a los extremos
    marginBottom: 24,
  },
  kpiCard: {
    backgroundColor: '#151B23',
    borderRadius: 12,
    padding: 16,
    width: '48%', // Toma casi la mitad del ancho para dejar un espacio en medio
    alignItems: 'center',
  },
  kpiLabel: {
    color: '#8A93A3',
    fontSize: 14,
    marginBottom: 8,
  },
  kpiValue: {
    color: '#3DDC84', // Verde positivo sugerido por Claude
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#151B23',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    color: '#F5F7FA',
    fontSize: 15,
    marginVertical: 4,
  },
  primaryButton: {
    backgroundColor: '#3DDC84',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  primaryButtonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: 'bold',
  }
});