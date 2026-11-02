import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getIniciales } from '../data/mockData';

export default function Avatar({ alumno, size = 42, highlight = true }) {
  const { theme } = useTheme();
  const base = { width: size, height: size, borderRadius: size / 2 };

  if (alumno.foto) {
    return <Image source={{ uri: alumno.foto }} style={base} />;
  }
  return (
    <View style={[base, { alignItems: 'center', justifyContent: 'center',
      backgroundColor: highlight ? theme.accentDark : theme.surface2 }]}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: size * 0.34 }}>
        {getIniciales(alumno.nombre_completo)}
      </Text>
    </View>
  );
}
