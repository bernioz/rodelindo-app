import React, { createContext, useState, useContext } from 'react';
import { eventosIniciales, visiblePara, ordenarEventos } from '../utils/eventos';

const EventosContext = createContext(null);

export function EventosProvider({ children }) {
  const [eventos, setEventos] = useState(eventosIniciales);

  const agregarEvento = (datos) => {
    const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setEventos((prev) => [...prev, { ...datos, id }]);
  };

  const editarEvento = (id, datos) => {
    setEventos((prev) => prev.map((e) => (e.id === id ? { ...datos, id } : e)));
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
