import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Abre la galería del celular y devuelve la lista de rutas (uri) elegidas ([] si cancela o no hay permiso)
export const elegirImagenes = async ({ multiple = false, aspecto } = {}) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso a tus fotos para poder elegir imágenes.');
    return [];
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: multiple,
    selectionLimit: multiple ? 10 : 1,
    allowsEditing: !multiple && !!aspecto, // el recorte no se puede combinar con selección múltiple
    aspect: aspecto,
    quality: 0.7,
  });
  if (res.canceled || !res.assets) return [];
  return res.assets.map((a) => a.uri);
};
