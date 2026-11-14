import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ScreenHeader({ title, subtitle }) {
  const { theme, fontSize } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.textPrim, fontSize: 18 * fontSize }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSec, fontSize: 12 * fontSize }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  logo: { width: 40, height: 40, borderRadius: 20 },
  text: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { marginTop: 1 },
});
