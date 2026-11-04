import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useEventos } from '../../../context/EventosContext';
import ScreenHeader from '../../../components/ScreenHeader';
import VistaAnio from '../components/VistaAnio';
import VistaMes from '../components/VistaMes';
import VistaDia from '../components/VistaDia';
import { MESES, hoyKey, fromKey, addDias, formatLargo } from '../../../utils/fechas';

// params opcionales: { vista: 'anio' | 'mes' | 'dia', fecha: 'YYYY-MM-DD' }
export default function CalendarioScreen({ route, navigation }) {
  const { user } = useAuth();
  const { theme, fontSize } = useTheme();
  const { getFechasConEventos } = useEventos();

  const esProfesor = user.rol === 'profesor';
  const categoriaFiltro = esProfesor ? undefined : user.categoria;

  const hoy = hoyKey();
  const params = route?.params ?? {};
  const inicial = params.fecha ?? hoy;

  const [vista, setVista] = useState(params.vista ?? 'anio');
  const [anio, setAnio] = useState(fromKey(inicial).getFullYear());
  const [mesIdx, setMesIdx] = useState(fromKey(inicial).getMonth());
  const [dia, setDia] = useState(inicial);

  const fs = (s) => s * fontSize;
  const conEventos = getFechasConEventos(categoriaFiltro);

  const irADia = (key) => {
    const d = fromKey(key);
    setAnio(d.getFullYear());
    setMesIdx(d.getMonth());
    setDia(key);
    setVista('dia');
  };

  const irAMes = (m) => {
    setMesIdx(m);
    setVista('mes');
  };

  const atras = () => {
    if (vista === 'dia') setVista('mes');
    else if (vista === 'mes') setVista('anio');
    else navigation.goBack();
  };

  const textoAtras = vista === 'dia' ? MESES[mesIdx] : vista === 'mes' ? `${anio}` : 'Volver';

  const anterior = () => {
    if (vista === 'anio') setAnio(anio - 1);
    else if (vista === 'mes') {
      const d = new Date(anio, mesIdx - 1, 1);
      setAnio(d.getFullYear());
      setMesIdx(d.getMonth());
    } else irADia(addDias(dia, -1));
  };

  const siguiente = () => {
    if (vista === 'anio') setAnio(anio + 1);
    else if (vista === 'mes') {
      const d = new Date(anio, mesIdx + 1, 1);
      setAnio(d.getFullYear());
      setMesIdx(d.getMonth());
    } else irADia(addDias(dia, 1));
  };

  const irAHoy = () => {
    const d = new Date();
    setAnio(d.getFullYear());
    setMesIdx(d.getMonth());
    setDia(hoy);
  };

  const titulo =
    vista === 'anio' ? `${anio}` :
    vista === 'mes' ? `${MESES[mesIdx]} ${anio}` :
    formatLargo(dia);

  // Del calendario al registro de asistencia (solo profesor)
  const tomarAsistencia = (categoria) => {
    navigation.navigate('ProfesorTabs', {
      screen: 'AsistenciaTab',
      params: { categoria, fecha: dia, nonce: Date.now() },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title="Calendario"
        subtitle={esProfesor ? 'Eventos y asistencia' : `Eventos · ${user.categoria}`}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Fila superior: atrás + hoy */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={atras}>
            <Text style={[styles.atras, { color: theme.accent, fontSize: fs(16) }]}>‹ {textoAtras}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={irAHoy}>
            <Text style={{ color: theme.accent, fontSize: fs(14), fontWeight: 'bold' }}>Hoy</Text>
          </TouchableOpacity>
        </View>

        {/* Título con flechas */}
        <View style={styles.tituloRow}>
          <TouchableOpacity onPress={anterior} style={styles.flechaBtn}>
            <Text style={[styles.flecha, { color: theme.accent }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.titulo, { color: theme.textPrim, fontSize: fs(vista === 'dia' ? 17 : 22) }]}>
            {titulo}
          </Text>
          <TouchableOpacity onPress={siguiente} style={styles.flechaBtn}>
            <Text style={[styles.flecha, { color: theme.accent }]}>›</Text>
          </TouchableOpacity>
        </View>

        {vista === 'anio' && (
          <VistaAnio anio={anio} hoy={hoy} conEventos={conEventos} onMes={irAMes} />
        )}
        {vista === 'mes' && (
          <VistaMes
            anio={anio}
            mesIdx={mesIdx}
            hoy={hoy}
            seleccion={dia}
            categoria={categoriaFiltro}
            onDia={irADia}
          />
        )}
        {vista === 'dia' && (
          <VistaDia
            dia={dia}
            hoy={hoy}
            esProfesor={esProfesor}
            categoriaAlumno={user.categoria}
            alumnoId={user.alumnoId}
            onTomarAsistencia={tomarAsistencia}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  atras: { fontWeight: '500' },
  tituloRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  flechaBtn: { paddingHorizontal: 14, paddingVertical: 2 },
  flecha: { fontSize: 30, fontWeight: 'bold' },
  titulo: { fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'center', flex: 1 },
});
