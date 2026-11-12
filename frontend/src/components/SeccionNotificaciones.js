import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useRecordatorios } from '../context/RecordatoriosContext';

export default function SeccionNotificaciones() {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { activos, setActivos, estado, probar } = useRecordatorios();
  const [resultado, setResultado] = useState(null);

  const fs = (s) => s * fontSize;
  const esProfesor = user.rol === 'profesor';

  const descripcion = esProfesor
    ? 'Te avisamos 30 minutos antes de cada clase o evento, y te recordamos registrar la asistencia si no la has tomado.'
    : 'Te avisamos 1 hora antes de tus clases, el día anterior de torneos y reuniones, y cada lunes si tienes cuotas pendientes.';

  const textoEstado = !activos
    ? 'Recordatorios desactivados'
    : estado.permiso === 'denegado'
      ? 'Sin permiso: actívalo en los ajustes del celular'
      : estado.error
        ? 'No se pudieron programar los recordatorios'
        : estado.permiso === 'concedido'
          ? `${estado.programadas} recordatorio${estado.programadas === 1 ? '' : 's'} programado${estado.programadas === 1 ? '' : 's'}`
          : 'Preparando…';

  const enviarPrueba = async () => {
    try {
      const ok = await probar();
      setResultado(ok ? 'Enviada ✓ (debería aparecer ahora mismo)' : 'No hay permiso para notificaciones');
    } catch (e) {
      setResultado('No se pudo enviar la notificación');
    }
  };

  return (
    <View>
      <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(16) }]}>Recordatorios</Text>
      <View style={[styles.card, { backgroundColor: theme.surface1 }]}>
        <View style={[styles.fila, { borderBottomColor: theme.border }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.label, { color: theme.textPrim, fontSize: fs(14) }]}>Recordatorios en el celular</Text>
            <Text style={{ color: theme.textSec, fontSize: fs(11), marginTop: 2 }}>{descripcion}</Text>
          </View>
          <Switch
            value={activos}
            onValueChange={setActivos}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        <Text style={{ color: theme.textSec, fontSize: fs(12), marginTop: 10 }}>{textoEstado}</Text>

        <TouchableOpacity
          style={[styles.boton, { borderColor: theme.accent }]}
          onPress={enviarPrueba}
        >
          <Text style={{ color: theme.accent, fontWeight: 'bold', fontSize: fs(13) }}>
            🔔 Enviar notificación de prueba
          </Text>
        </TouchableOpacity>
        {resultado ? (
          <Text style={{ color: theme.textMuted, fontSize: fs(11), marginTop: 6 }}>{resultado}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16 },
  fila: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1 },
  label: { fontWeight: '500' },
  boton: { borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12 },
});
