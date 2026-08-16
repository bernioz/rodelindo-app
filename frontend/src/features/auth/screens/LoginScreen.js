import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Credenciales de prueba hardcodeadas — después se conecta al backend
    if (email === 'alumno@test.com' && password === '1234') {
      login('alumno');
    } else if (email === 'profesor@test.com' && password === '1234') {
      login('profesor');
    } else {
      Alert.alert('Error', 'Correo o contraseña incorrectos.\n\nPrueba:\nalumno@test.com / 1234\nprofesor@test.com / 1234');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Logo / Header */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>FC</Text>
            <Text style={styles.logoTextSub}>RR</Text>
          </View>
          <Text style={styles.title}>Rodelindo Román</Text>
          <Text style={styles.subtitle}>Escuela de Fútbol Oficial · Concepción</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#4A5568"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#4A5568"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Hint credenciales de prueba */}
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Credenciales de prueba</Text>
          <Text style={styles.hintText}>alumno@test.com · 1234</Text>
          <Text style={styles.hintText}>profesor@test.com · 1234</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a6b3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  logoTextSub: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8A93A3',
    fontSize: 13,
    marginTop: 4,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    color: '#8A93A3',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#151B23',
    color: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A3341',
  },
  button: {
    backgroundColor: '#3DDC84',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#151B23',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A3341',
  },
  hintTitle: {
    color: '#8A93A3',
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hintText: {
    color: '#3DDC84',
    fontSize: 12,
    lineHeight: 20,
  },
});
