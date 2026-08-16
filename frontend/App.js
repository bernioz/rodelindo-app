import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AlumnosProvider } from './src/context/AlumnosContext';

import LoginScreen from './src/features/auth/screens/LoginScreen';
import ParentDashboardScreen from './src/features/dashboard/screens/ParentDashboardScreen';
import ProfesorHomeScreen from './src/features/profesor/screens/ProfesorHomeScreen';
import AlumnosScreen from './src/features/profesor/screens/AlumnosScreen';
import AsistenciaScreen from './src/features/profesor/screens/AsistenciaScreen';
import PerfilProfesorScreen from './src/features/profesor/screens/PerfilProfesorScreen';
import PerfilAlumnoScreen from './src/features/profesor/screens/PerfilAlumnoScreen';

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#151B23',
          borderTopColor: '#2A3341',
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: '#3DDC84',
        tabBarInactiveTintColor: '#8A93A3',
        tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
      }}
    >
      <Tab.Screen name="InicioTab" component={ProfesorHomeScreen}
        options={{ tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="AlumnosTab" component={AlumnosStack}
        options={{ tabBarLabel: 'Alumnos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text> }} />
      <Tab.Screen name="AsistenciaTab" component={AsistenciaScreen}
        options={{ tabBarLabel: 'Asistencia',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text> }} />
      <Tab.Screen name="PerfilTab" component={PerfilProfesorScreen}
        options={{ tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  if (!user) return <LoginScreen />;
  if (user.rol === 'profesor') return <ProfesorTabs />;
  return <ParentDashboardScreen />;
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
