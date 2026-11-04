import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AlumnosProvider } from './src/context/AlumnosContext';
import { EventosProvider } from './src/context/EventosContext';

// Común
import LoginScreen from './src/features/auth/screens/LoginScreen';
import CalendarioScreen from './src/features/calendario/screens/CalendarioScreen';

// Profesor
import ProfesorHomeScreen from './src/features/profesor/screens/ProfesorHomeScreen';
import AlumnosScreen from './src/features/profesor/screens/AlumnosScreen';
import AsistenciaScreen from './src/features/profesor/screens/AsistenciaScreen';
import PerfilProfesorScreen from './src/features/profesor/screens/PerfilProfesorScreen';
import PerfilAlumnoScreen from './src/features/profesor/screens/PerfilAlumnoScreen';

// Alumno
import AlumnoHomeScreen from './src/features/alumno/screens/AlumnoHomeScreen';
import RankingScreen from './src/features/alumno/screens/RankingScreen';
import AlumnoPerfilScreen from './src/features/alumno/screens/AlumnoPerfilScreen';
import PerfilCompaneroScreen from './src/features/alumno/screens/PerfilCompaneroScreen';
import NewsScreen from './src/features/alumno/screens/NewsScreen';
import GalleryScreen from './src/features/alumno/screens/GalleryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlumnosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaAlumnos" component={AlumnosScreen} />
      <Stack.Screen name="PerfilAlumno" component={PerfilAlumnoScreen} />
    </Stack.Navigator>
  );
}

function RankingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RankingList" component={RankingScreen} />
      <Stack.Screen name="PerfilCompanero" component={PerfilCompaneroScreen} />
    </Stack.Navigator>
  );
}

const icono = (emoji) => ({ color }) => <Text style={{ fontSize: 20, color }}>{emoji}</Text>;

function useTabOptions() {
  const { theme } = useTheme();
  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: theme.surface1,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      paddingBottom: 6,
      paddingTop: 6,
      height: 62,
    },
    tabBarActiveTintColor: theme.accent,
    tabBarInactiveTintColor: theme.textSec,
    tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
  };
}

function ProfesorTabs() {
  const opciones = useTabOptions();
  return (
    <Tab.Navigator screenOptions={opciones}>
      <Tab.Screen name="InicioTab" component={ProfesorHomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: icono('🏠') }} />
      <Tab.Screen name="AlumnosTab" component={AlumnosStack}
        options={{ tabBarLabel: 'Alumnos', tabBarIcon: icono('👥') }} />
      <Tab.Screen name="AsistenciaTab" component={AsistenciaScreen}
        options={{ tabBarLabel: 'Asistencia', tabBarIcon: icono('✅') }} />
      <Tab.Screen name="PerfilTab" component={PerfilProfesorScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: icono('👤') }} />
    </Tab.Navigator>
  );
}

function AlumnoTabs() {
  const opciones = useTabOptions();
  return (
    <Tab.Navigator screenOptions={opciones}>
      <Tab.Screen name="InicioTab" component={AlumnoHomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: icono('🏠') }} />
      <Tab.Screen name="RankingTab" component={RankingStack}
        options={{ tabBarLabel: 'Ranking', tabBarIcon: icono('🏆') }} />
      <Tab.Screen name="PerfilTab" component={AlumnoPerfilScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: icono('👤') }} />
      <Tab.Screen name="NoticiasTab" component={NewsScreen}
        options={{ tabBarLabel: 'Noticias', tabBarIcon: icono('📰') }} />
      <Tab.Screen name="GaleriaTab" component={GalleryScreen}
        options={{ tabBarLabel: 'Galería', tabBarIcon: icono('🖼') }} />
    </Tab.Navigator>
  );
}

// Stack raíz: las pestañas + el Calendario (se abre desde Inicio o desde Asistencia)
function ProfesorRoot() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfesorTabs" component={ProfesorTabs} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
    </Stack.Navigator>
  );
}

function AlumnoRoot() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AlumnoTabs" component={AlumnoTabs} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  if (!user) return <LoginScreen />;
  if (user.rol === 'profesor') return <ProfesorRoot />;
  return <AlumnoRoot />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AlumnosProvider>
        <EventosProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </EventosProvider>
      </AlumnosProvider>
    </ThemeProvider>
  );
}
