import { addDias, hoyKey } from './fechas';
import { esDiaDeClase } from './asistencia';

export const TIPOS = ['Clase', 'Torneo', 'Reunión', 'Otro'];
export const CATEGORIAS = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];
export const DIRIGIDO_A = ['Apoderados', 'Profesores', 'Todos'];

export const COLOR_TIPO = {
  Clase: '#3DDC84',
  Torneo: '#4285F4',
  'Reunión': '#F5A623',
  Otro: '#8A93A3',
};

// Qué campos se editan según el tipo de evento
export const CAMPOS_POR_TIPO = {
  Clase: ['categoria', 'hora', 'lugar'],
  Torneo: ['titulo', 'categoria', 'hora', 'lugar', 'rival', 'resultado'],
  'Reunión': ['titulo', 'dirigidoA', 'categoria', 'hora', 'lugar'],
  Otro: ['titulo', 'categoria', 'hora', 'lugar', 'notas'],
};

const ETIQUETAS = {
  titulo: { Torneo: 'Nombre del torneo', 'Reunión': 'Motivo de la reunión', Otro: 'Título' },
  categoria: 'Categoría',
  dirigidoA: 'Dirigida a',
  hora: 'Hora (ej: 17:30)',
  lugar: 'Lugar',
  rival: 'Rival / organizador',
  resultado: 'Resultado (se completa después)',
  notas: 'Notas',
};

export const etiquetaCampo = (tipo, campo) => {
  const e = ETIQUETAS[campo];
  return typeof e === 'object' ? e[tipo] : e;
};

export const eventoVacio = () => ({
  tipo: 'Clase', titulo: '', hora: '', lugar: '', categoria: 'Sub-12',
  dirigidoA: 'Apoderados', rival: '', resultado: '', notas: '',
});

export const tituloEvento = (ev) =>
  ev.tipo === 'Clase' ? `Entrenamiento ${ev.categoria}` : ev.titulo;

// Línea de detalle: hora · lugar · categoría, etc.
export const detalleEvento = (ev) => {
  const partes = [];
  if (ev.hora) partes.push(ev.hora);
  if (ev.lugar) partes.push(ev.lugar);
  if (ev.tipo !== 'Clase' && ev.categoria && ev.categoria !== 'Todas') partes.push(ev.categoria);
  if (ev.tipo === 'Reunión' && ev.dirigidoA) partes.push(`para ${ev.dirigidoA.toLowerCase()}`);
  if (ev.tipo === 'Torneo' && ev.resultado) partes.push(`🏆 ${ev.resultado}`);
  return partes.join(' · ');
};

const HORA_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

// "9:30" -> "09:30" (así ordenar por texto funciona)
export const normalizarHora = (h) => {
  const t = (h || '').trim();
  if (!t) return '';
  const [hh, mm] = t.split(':');
  return `${hh.padStart(2, '0')}:${mm}`;
};

export const validarEvento = (ev) => {
  const errores = {};
  const campos = CAMPOS_POR_TIPO[ev.tipo];
  if (campos.includes('titulo') && !(ev.titulo || '').trim()) {
    errores.titulo = 'Este campo es obligatorio';
  }
  if (ev.hora && !HORA_RE.test(ev.hora.trim())) {
    errores.hora = 'Usa el formato 17:30';
  }
  if (ev.tipo === 'Clase' && (!ev.categoria || ev.categoria === 'Todas')) {
    errores.categoria = 'Elige una categoría';
  }
  return errores;
};

// Deja solo los campos que corresponden al tipo (el resto se vacía)
export const limpiarEvento = (ev) => {
  const base = eventoVacio();
  const campos = CAMPOS_POR_TIPO[ev.tipo];
  const limpio = { fecha: ev.fecha, tipo: ev.tipo, categoria: 'Todas' };
  Object.keys(base).forEach((k) => {
    if (k === 'tipo') return;
    limpio[k] = campos.includes(k) ? (typeof ev[k] === 'string' ? ev[k].trim() : ev[k]) : '';
  });
  limpio.hora = normalizarHora(limpio.hora);
  if (!campos.includes('categoria')) limpio.categoria = 'Todas';
  return limpio;
};

// ¿Lo puede ver alguien de esa categoría? (sin categoría = ve todo, como el profesor)
export const visiblePara = (ev, categoria) =>
  !categoria || ev.categoria === 'Todas' || ev.categoria === categoria;

export const ordenarEventos = (a, b) =>
  a.fecha.localeCompare(b.fecha) || (a.hora || '99:99').localeCompare(b.hora || '99:99');

// Eventos de prueba relativos a hoy (siempre se ven bien en la demo)
export const eventosIniciales = () => {
  const hoy = hoyKey();
  const lista = [];
  let n = 0;
  const add = (e) => {
    lista.push({ id: `seed-${n++}`, ...eventoVacio(), categoria: 'Todas', dirigidoA: '', ...e });
  };

  // Calendarización semanal: clases lun/mié/vie
  for (let k = -21; k <= 28; k++) {
    const fecha = addDias(hoy, k);
    if (!esDiaDeClase(fecha)) continue;
    add({ fecha, tipo: 'Clase', categoria: 'Sub-8', hora: '16:00', lugar: 'Cancha Auxiliar' });
    add({ fecha, tipo: 'Clase', categoria: 'Sub-12', hora: '17:30', lugar: 'Cancha Principal' });
  }

  add({ fecha: addDias(hoy, 5), tipo: 'Torneo', titulo: 'Copa Regional Infantil', categoria: 'Sub-12',
        hora: '10:00', lugar: 'Estadio Municipal', rival: 'Varios clubes' });
  add({ fecha: addDias(hoy, 6), tipo: 'Reunión', titulo: 'Reunión de apoderados', dirigidoA: 'Apoderados',
        categoria: 'Todas', hora: '19:00', lugar: 'Sala de reuniones' });
  add({ fecha: addDias(hoy, -9), tipo: 'Torneo', titulo: 'Torneo amistoso', categoria: 'Sub-12',
        hora: '11:00', lugar: 'Cancha Municipal', rival: 'Club Deportivo Lota', resultado: '2.º lugar' });
  return lista;
};
