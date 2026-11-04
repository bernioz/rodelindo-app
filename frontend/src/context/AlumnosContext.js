import React, { createContext, useState, useContext, useMemo } from 'react';
import { toKey } from '../utils/fechas';
import { fechasSemilla, generarSesiones, calcAsistencia, historialAlumno } from '../utils/asistencia';

// "semilla" = % aproximado con el que se generan las clases de prueba.
// El % real que se muestra en la app se calcula siempre a partir de las sesiones guardadas.
const SEMILLA = [
  { id: 1,  nombre_completo: 'Mateo González',   categoria: 'Sub-12', semilla: 87, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 2,  nombre_completo: 'Pablo Herrera',    categoria: 'Sub-12', semilla: 92, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 3,  nombre_completo: 'Cristóbal Rojas',  categoria: 'Sub-12', semilla: 61, matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 4,  nombre_completo: 'Lucas Vega',       categoria: 'Sub-12', semilla: 79, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 5,  nombre_completo: 'Diego Muñoz',      categoria: 'Sub-12', semilla: 55, matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 6,  nombre_completo: 'Ignacio Pérez',    categoria: 'Sub-14', semilla: 90, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 7,  nombre_completo: 'Bastián Castro',   categoria: 'Sub-14', semilla: 73, matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 8,  nombre_completo: 'Tomás Flores',     categoria: 'Sub-14', semilla: 68, matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 9,  nombre_completo: 'Felipe Morales',   categoria: 'Sub-10', semilla: 95, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 10, nombre_completo: 'Nicolás Silva',    categoria: 'Sub-10', semilla: 82, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 11, nombre_completo: 'Agustín Torres',   categoria: 'Sub-8',  semilla: 88, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 12, nombre_completo: 'Emilio Díaz',      categoria: 'Sub-8',  semilla: 71, matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 13, nombre_completo: 'Sebastián Ramos',  categoria: 'Sub-16', semilla: 77, matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 14, nombre_completo: 'Rodrigo Vargas',   categoria: 'Sub-16', semilla: 84, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
];

const FECHAS_INICIALES = fechasSemilla();
const INICIO_TEMPORADA = FECHAS_INICIALES[0];
const ALUMNOS_INICIALES = SEMILLA.map((a) => ({ ...a, fechaIngreso: INICIO_TEMPORADA }));
const SESIONES_INICIALES = generarSesiones(ALUMNOS_INICIALES, FECHAS_INICIALES);

// Ciclo de un mes: sin definir → pagado → pendiente → no aplica → sin definir
const siguienteEstado = (actual) => {
  if (actual === undefined) return true;
  if (actual === true) return false;
  if (actual === false) return 'na';
  return undefined;
};

const AlumnosContext = createContext(null);

export function AlumnosProvider({ children }) {
  const [base, setBase] = useState(ALUMNOS_INICIALES);
  const [sesiones, setSesiones] = useState(SESIONES_INICIALES);

  // Alumnos con su % de asistencia calculado desde las sesiones
  const alumnos = useMemo(
    () => base.map((a) => ({ ...a, asistencia: calcAsistencia(a, sesiones) })),
    [base, sesiones]
  );

  const agregarAlumno = (alumno) => {
    setBase((prev) => [
      ...prev,
      { ...alumno, id: Date.now(), pagos: {}, fechaIngreso: toKey(new Date()) },
    ]);
  };

  const getByCategoria = (cat) => alumnos.filter((a) => a.categoria === cat);

  const actualizarPago = (alumnoId, mes) => {
    setBase((prev) => prev.map((a) => {
      if (a.id !== alumnoId) return a;
      const siguiente = siguienteEstado(a.pagos[mes]);
      const nuevosPagos = { ...a.pagos };
      if (siguiente === undefined) delete nuevosPagos[mes];
      else nuevosPagos[mes] = siguiente;
      return { ...a, pagos: nuevosPagos };
    }));
  };

  const actualizarMatricula = (alumnoId) => {
    setBase((prev) => prev.map((a) =>
      a.id === alumnoId ? { ...a, matricula: !a.matricula } : a
    ));
  };

  const actualizarFoto = (alumnoId, uri) => {
    setBase((prev) => prev.map((a) => (a.id === alumnoId ? { ...a, foto: uri } : a)));
  };

  // ---- Asistencia por clase ----
  const getSesion = (categoria, fecha) =>
    sesiones.find((s) => s.categoria === categoria && s.fecha === fecha);

  // Crea o reemplaza la sesión de una categoría en una fecha
  const guardarAsistencia = (categoria, fecha, presentes) => {
    setSesiones((prev) => {
      const i = prev.findIndex((s) => s.categoria === categoria && s.fecha === fecha);
      if (i >= 0) {
        const copia = [...prev];
        copia[i] = { ...copia[i], presentes };
        return copia;
      }
      return [...prev, { id: `${categoria}-${fecha}`, fecha, categoria, presentes }];
    });
  };

  // { 'YYYY-MM-DD': true|false } para el calendario de un alumno
  const getHistorial = (alumnoId) => {
    const alumno = base.find((a) => a.id === alumnoId);
    return alumno ? historialAlumno(alumno, sesiones) : {};
  };

  return (
    <AlumnosContext.Provider
      value={{
        alumnos, agregarAlumno, getByCategoria,
        actualizarPago, actualizarMatricula, actualizarFoto,
        sesiones, getSesion, guardarAsistencia, getHistorial,
      }}
    >
      {children}
    </AlumnosContext.Provider>
  );
}

export function useAlumnos() {
  return useContext(AlumnosContext);
}
