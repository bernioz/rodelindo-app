import React, { createContext, useState, useContext } from 'react';

const ALUMNOS_INICIALES = [
  { id: 1,  nombre_completo: 'Mateo González',   categoria: 'Sub-12', asistencia: 87, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 2,  nombre_completo: 'Pablo Herrera',    categoria: 'Sub-12', asistencia: 92, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 3,  nombre_completo: 'Cristóbal Rojas',  categoria: 'Sub-12', asistencia: 61, matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 4,  nombre_completo: 'Lucas Vega',       categoria: 'Sub-12', asistencia: 79, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 5,  nombre_completo: 'Diego Muñoz',      categoria: 'Sub-12', asistencia: 55, matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 6,  nombre_completo: 'Ignacio Pérez',    categoria: 'Sub-14', asistencia: 90, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 7,  nombre_completo: 'Bastián Castro',   categoria: 'Sub-14', asistencia: 73, matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 8,  nombre_completo: 'Tomás Flores',     categoria: 'Sub-14', asistencia: 68, matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 9,  nombre_completo: 'Felipe Morales',   categoria: 'Sub-10', asistencia: 95, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 10, nombre_completo: 'Nicolás Silva',    categoria: 'Sub-10', asistencia: 82, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 11, nombre_completo: 'Agustín Torres',   categoria: 'Sub-8',  asistencia: 88, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 12, nombre_completo: 'Emilio Díaz',      categoria: 'Sub-8',  asistencia: 71, matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 13, nombre_completo: 'Sebastián Ramos',  categoria: 'Sub-16', asistencia: 77, matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 14, nombre_completo: 'Rodrigo Vargas',   categoria: 'Sub-16', asistencia: 84, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
];

// Ciclo de estados: undefined → true → false → undefined
const siguienteEstado = (actual) => {
  if (actual === undefined) return true;
  if (actual === true) return false;
  return undefined;
};

const AlumnosContext = createContext(null);

export function AlumnosProvider({ children }) {
  const [alumnos, setAlumnos] = useState(ALUMNOS_INICIALES);

  const agregarAlumno = (alumno) => {
    setAlumnos((prev) => [...prev, { ...alumno, id: Date.now(), asistencia: 0, pagos: {} }]);
  };

  // Cicla el estado de un mes: undefined → true → false → undefined
  const actualizarPago = (alumnoId, mes) => {
    setAlumnos((prev) => prev.map((a) => {
      if (a.id !== alumnoId) return a;
      const actual = a.pagos[mes];
      const siguiente = siguienteEstado(actual);
      const nuevosPagos = { ...a.pagos };
      if (siguiente === undefined) {
        delete nuevosPagos[mes];
      } else {
        nuevosPagos[mes] = siguiente;
      }
      return { ...a, pagos: nuevosPagos };
    }));
  };

  // Alterna matrícula true/false
  const actualizarMatricula = (alumnoId) => {
    setAlumnos((prev) => prev.map((a) =>
      a.id === alumnoId ? { ...a, matricula: !a.matricula } : a
    ));
  };

  const getByCategoria = (cat) => alumnos.filter((a) => a.categoria === cat);

  return (
    <AlumnosContext.Provider value={{ alumnos, agregarAlumno, getByCategoria, actualizarPago, actualizarMatricula }}>
      {children}
    </AlumnosContext.Provider>
  );
}

export function useAlumnos() {
  return useContext(AlumnosContext);
}
