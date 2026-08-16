import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AlumnosProvider } from './src/context/AlumnosContext';

// Profesor
import LoginScreen from './src/features/auth/screens/LoginScreen';
import ProfesorHomeScreen from './src/features/profesor/screens/ProfesorHomeScreen';
import AlumnosScreen from './src/features/profesor/screens/AlumnosScreen';
import AsistenciaScreen from './src/features/profesor/screens/AsistenciaScreen';
import PerfilProfesorScreen from './src/features/profesor/screens/PerfilProfesorScreen';
import PerfilAlumnoScreen from './src/features/profesor/screens/PerfilAlumnoScreen';

// Alumno
import AlumnoHomeScreen from './src/features/alumno/screens/AlumnoHomeScreen';
import RankingScreen from './src/features/alumno/screens/RankingScreen';
import AlumnoPerfilScreen from './src/features/alumno/screens/AlumnoPerfilScreen';

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

function ProfesorTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.surface1, borderTopColor: theme.border, borderTopWidth: 1, paddingBottom: 6, paddingTop: 6, height: 62 },
      tabBarActiveTintColor: theme.accent,
      tabBarInactiveTintColor: theme.textSec,
      tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
    }}>
      <Tab.Screen name="InicioTab" component={ProfesorHomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="AlumnosTab" component={AlumnosStack}
        options={{ tabBarLabel: 'Alumnos', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text> }} />
      <Tab.Screen name="AsistenciaTab" component={AsistenciaScreen}
        options={{ tabBarLabel: 'Asistencia', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text> }} />
      <Tab.Screen name="PerfilTab" component={PerfilProfesorScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function AlumnoTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.surface1, borderTopColor: theme.border, borderTopWidth: 1, paddingBottom: 6, paddingTop: 6, height: 62 },
      tabBarActiveTintColor: theme.accent,
      tabBarInactiveTintColor: theme.textSec,
      tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
    }}>
      <Tab.Screen name="InicioTab" component={AlumnoHomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="RankingTab" component={RankingScreen}
        options={{ tabBarLabel: 'Ranking', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text> }} />
      <Tab.Screen name="PerfilTab" component={AlumnoPerfilScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  if (!user) return <LoginScreen />;
  if (user.rol === 'profesor') return <ProfesorTabs />;
  return <AlumnoTabs />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AlumnosProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AlumnosProvider>
    </ThemeProvider>
  );
}
