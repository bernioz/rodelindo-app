import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import Avatar from '../../../components/Avatar';
import ScreenHeader from '../../../components/ScreenHeader';

export default function PerfilCompaneroScreen({ route, navigation }) {
  const { theme, fontSize } = useTheme();
  const { alumnos, getByCategoria } = useAlumnos();
  const alumno = alumnos.find((a) => a.id === route.params.alumnoId);
  if (!alumno) return null;

  const ranking = [...getByCategoria(alumno.categoria)].sort((a, b) => b.asistencia - a.asistencia);
  const posicion = ranking.findIndex((a) => a.id === alumno.id) + 1;
  const color = alumno.asistencia >= 80 ? theme.accent : alumno.asistencia >= 60 ? '#F5A623' : '#FF5A5F';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={alumno.nombre_completo} subtitle={alumno.categoria} />
      <View style={{ padding: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.accent, fontSize: 17 }}>‹ Volver</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Avatar alumno={alumno} size={80} />
          <Text style={{ color: theme.textPrim, fontSize: 22 * fontSize, fontWeight: 'bold', marginTop: 12 }}>
            {alumno.nombre_completo}
          </Text>
        </View>

        <View style={styles.row}>
          {[
            { val: `${alumno.asistencia}%`, label: 'Asistencia', c: color },
            { val: `#${posicion}`, label: `en ${alumno.categoria}`, c: theme.accent },
          ].map((s) => (
            <View key={s.label} style={[styles.card, { backgroundColor: theme.surface1 }]}>
              <Text style={{ color: s.c, fontSize: 24 * fontSize, fontWeight: 'bold' }}>{s.val}</Text>
              <Text style={{ color: theme.textSec, fontSize: 11 * fontSize }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 4 },
});
