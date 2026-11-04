// Fechas como texto "YYYY-MM-DD" en hora LOCAL (evita errores de zona horaria).
export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
// Semana parte en lunes
export const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const DIAS_LARGOS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const hoyKey = () => toKey(new Date());

export const addDias = (key, n) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
};

// índice de día con lunes = 0
const idxDia = (d) => (d.getDay() + 6) % 7;

export const formatCorto = (key) => {
  const d = fromKey(key);
  return `${DIAS_CORTOS[idxDia(d)]} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3).toLowerCase()}`;
};

export const formatLargo = (key) => {
  const d = fromKey(key);
  return `${DIAS_LARGOS[idxDia(d)]} ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;
};

// ---- Utilidades de grilla mensual ----
export const diasEnMes = (anio, mesIdx) => new Date(anio, mesIdx + 1, 0).getDate();

// Celdas de un mes (semana parte en lunes): null = vacío, número = día
export const celdasMes = (anio, mesIdx) => {
  const offset = idxDia(new Date(anio, mesIdx, 1));
  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes(anio, mesIdx); d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);
  return celdas;
};

export const keyDe = (anio, mesIdx, dia) => toKey(new Date(anio, mesIdx, dia));
