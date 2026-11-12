import React, { createContext, useState, useContext } from 'react';
import { hoyKey, addDias } from '../utils/fechas';
import { visiblePara } from '../utils/eventos';

const ComunidadContext = createContext(null);

// Noticias de ejemplo (fechas relativas a hoy). categoria: 'Todas' o 'Sub-XX'
const noticiasIniciales = () => {
  const hoy = hoyKey();
  return [
    {
      id: 'n-1', fecha: addDias(hoy, -10), categoria: 'Todas', imagen: null, autor: 'Dirección',
      titulo: 'Bienvenidos a la temporada',
      cuerpo: 'Comenzamos una nueva temporada en la escuela. Recuerden revisar el calendario para conocer los horarios de cada categoría y mantener al día las cuotas.',
    },
    {
      id: 'n-2', fecha: addDias(hoy, -3), categoria: 'Sub-12', imagen: null, autor: 'Prof. Rodrigo Vera',
      titulo: 'Entrenamiento especial de Sub-12',
      cuerpo: 'Esta semana trabajaremos definiciones frente al arco. Traer canilleras y una botella de agua.',
    },
    {
      id: 'n-3', fecha: addDias(hoy, -1), categoria: 'Todas', imagen: null, autor: 'Prof. Rodrigo Vera',
      titulo: 'Inscripciones abiertas para el torneo regional',
      cuerpo: 'Ya están abiertas las inscripciones para la Copa Regional Infantil. Los detalles de fecha y lugar están en el calendario.',
    },
  ];
};

export function ComunidadProvider({ children }) {
  const [noticias, setNoticias] = useState(noticiasIniciales);
  const [fotos, setFotos] = useState([]);

  const nuevoId = (prefijo) => `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // ---- Noticias ----
  const publicarNoticia = (datos, autor) => {
    setNoticias((prev) => [...prev, { ...datos, id: nuevoId('n'), fecha: hoyKey(), autor }]);
  };
  const editarNoticia = (id, datos) => {
    setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, ...datos } : n)));
  };
  const eliminarNoticia = (id) => setNoticias((prev) => prev.filter((n) => n.id !== id));

  // categoria undefined = todas (vista del profesor). Más nuevas primero.
  const getNoticias = (categoria) =>
    noticias
      .filter((n) => visiblePara(n, categoria))
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

  // ---- Galería ----
  // uris: lista de fotos elegidas; se suben todas con la misma categoría y descripción
  const subirFotos = (uris, { categoria, descripcion }) => {
    const fecha = hoyKey();
    setFotos((prev) => [
      ...prev,
      ...uris.map((uri) => ({ id: nuevoId('f'), uri, categoria, descripcion: descripcion || '', fecha })),
    ]);
  };
  const eliminarFoto = (id) => setFotos((prev) => prev.filter((f) => f.id !== id));

  const getFotos = (categoria) =>
    fotos
      .filter((f) => visiblePara(f, categoria))
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

  return (
    <ComunidadContext.Provider
      value={{
        noticias, publicarNoticia, editarNoticia, eliminarNoticia, getNoticias,
        fotos, subirFotos, eliminarFoto, getFotos,
      }}
    >
      {children}
    </ComunidadContext.Provider>
  );
}

export function useComunidad() {
  return useContext(ComunidadContext);
}
