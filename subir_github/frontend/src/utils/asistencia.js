import { addDias, fromKey, hoyKey } from './fechas';

// Días de entrenamiento habituales: lunes, miércoles y viernes (getDay: 0=dom ... 6=sáb)
export const DIAS_ENTRENAMIENTO = [1, 3, 5];
const SEMANAS_HISTORIAL = 8;

export const esDiaDeClase = (key) => DIAS_ENTRENAMIENTO.includes(fromKey(key).getDay());

// Fechas de clases pasadas (de la más antigua a la de ayer) para poblar datos de prueba
export const fechasSemilla = () => {
  const hoy = hoyKey();
  const fechas = [];
  for (let k = SEMANAS_HISTORIAL * 7; k >= 1; k--) {
    const key = addDias(hoy, -k);
    if (esDiaDeClase(key)) fechas.push(key);
  }
  return fechas;
};

// Número "aleatorio" pero siempre igual para los mismos datos (el mock no cambia al recargar)
const pseudo = (a, b) => {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Crea sesiones de prueba: cada alumno asiste con probabilidad ~ su "semilla" (%)
export const generarSesiones = (alumnos, fechas) => {
  const categorias = [...new Set(alumnos.map((a) => a.categoria))];
  const sesiones = [];
  categorias.forEach((categoria) => {
    fechas.forEach((fecha, idx) => {
      const presentes = alumnos
        .filter((a) => a.categoria === categoria && pseudo(a.id, idx) < a.semilla / 100)
        .map((a) => a.id);
      sesiones.push({ id: `${categoria}-${fecha}`, fecha, categoria, presentes });
    });
  });
  return sesiones;
};

// Sesiones que le corresponden a un alumno: de su categoría y desde que ingresó
const sesionesDe = (alumno, sesiones) =>
  sesiones.filter((s) => s.categoria === alumno.categoria && s.fecha >= alumno.fechaIngreso);

// % de asistencia = clases a las que fue / clases realizadas desde su ingreso
export const calcAsistencia = (alumno, sesiones) => {
  const propias = sesionesDe(alumno, sesiones);
  if (propias.length === 0) return 0;
  const asistidas = propias.filter((s) => s.presentes.includes(alumno.id)).length;
  return Math.round((asistidas / propias.length) * 100);
};

// Mapa { 'YYYY-MM-DD': true | false } para pintar el calendario (true = asistió, false = faltó)
export const historialAlumno = (alumno, sesiones) => {
  const mapa = {};
  sesionesDe(alumno, sesiones).forEach((s) => {
    mapa[s.fecha] = s.presentes.includes(alumno.id);
  });
  return mapa;
};
