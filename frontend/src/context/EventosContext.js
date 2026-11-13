import React, { createContext, useState, useContext } from 'react';
import { eventosIniciales, visiblePara, ordenarEventos, normalizarEvento } from '../utils/eventos';

const EventosContext = createContext(null);

export function EventosProvider({ children }) {
  const [eventos, setEventos] = useState(eventosIniciales);

  const nuevoId = () => `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Acepta el formato del calendario ({categoria}) y el del admin ({categorias: [...]}):
  // si vienen varias categorías, se crea un evento por cada una.
  const agregarEvento = (datos) => {
    const nuevos = normalizarEvento(datos).map((e) => ({ ...e, id: nuevoId() }));
    setEventos((prev) => [...prev, ...nuevos]);
  };

  // Edita un evento conservando los campos que el formulario no trae (rival, resultado, notas…)
  const editarEvento = (id, datos) => {
    setEventos((prev) => {
      const actual = prev.find((e) => e.id === id);
      if (!actual) return prev;
      const mezcla = { ...actual, ...datos };
      if (datos.categorias) delete mezcla.categoria;   // manda la lista del admin
      else delete mezcla.categorias;                   // manda la categoría del calendario
      const [primero, ...resto] = normalizarEvento(mezcla);
      return [
        ...prev.map((e) => (e.id === id ? { ...primero, id } : e)),
        ...resto.map((e) => ({ ...e, id: nuevoId() })),
      ];
    });
  };

  const eliminarEvento = (id) => {
    setEventos((prev) => prev.filter((e) => e.id !== id));
  };

  // categoria undefined = todos los eventos (vista del profesor)
  const getEventosDia = (fecha, categoria) =>
    eventos.filter((e) => e.fecha === fecha && visiblePara(e, categoria)).sort(ordenarEventos);

  const getEventosRango = (desde, hasta, categoria) =>
    eventos
      .filter((e) => e.fecha >= desde && e.fecha <= hasta && visiblePara(e, categoria))
      .sort(ordenarEventos);

  const getProximos = (desde, categoria, limite = 8) =>
    eventos
      .filter((e) => e.fecha >= desde && visiblePara(e, categoria))
      .sort(ordenarEventos)
      .slice(0, limite);

  // Conjunto de fechas que tienen al menos un evento (para marcar el calendario)
  const getFechasConEventos = (categoria) =>
    new Set(eventos.filter((e) => visiblePara(e, categoria)).map((e) => e.fecha));

  return (
    <EventosContext.Provider
      value={{
        eventos, agregarEvento, editarEvento, eliminarEvento,
        getEventosDia, getEventosRango, getProximos, getFechasConEventos,
      }}
    >
      {children}
    </EventosContext.Provider>
  );
}

export function useEventos() {
  return useContext(EventosContext);
}
