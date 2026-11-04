export const alumnos = [
  { id: 1,  nombre_completo: 'Mateo González',   categoria: 'Sub-12', asistencia: 87, numero_camiseta: 10, posicion: 'Delantero',    goles: 12, partidos: 10, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 2,  nombre_completo: 'Pablo Herrera',    categoria: 'Sub-12', asistencia: 92, numero_camiseta: 7,  posicion: 'Mediocampista', goles: 8,  partidos: 12, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 3,  nombre_completo: 'Cristóbal Rojas',  categoria: 'Sub-12', asistencia: 61, numero_camiseta: 4,  posicion: 'Defensa',       goles: 1,  partidos: 7,  matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 4,  nombre_completo: 'Lucas Vega',       categoria: 'Sub-12', asistencia: 79, numero_camiseta: 1,  posicion: 'Portero',       goles: 0,  partidos: 9,  matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 5,  nombre_completo: 'Diego Muñoz',      categoria: 'Sub-12', asistencia: 55, numero_camiseta: 9,  posicion: 'Delantero',    goles: 3,  partidos: 6,  matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 6,  nombre_completo: 'Ignacio Pérez',    categoria: 'Sub-14', asistencia: 90, numero_camiseta: 8,  posicion: 'Mediocampista', goles: 6,  partidos: 11, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 7,  nombre_completo: 'Bastián Castro',   categoria: 'Sub-14', asistencia: 73, numero_camiseta: 5,  posicion: 'Defensa',       goles: 2,  partidos: 8,  matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 8,  nombre_completo: 'Tomás Flores',     categoria: 'Sub-14', asistencia: 68, numero_camiseta: 11, posicion: 'Delantero',    goles: 5,  partidos: 7,  matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 9,  nombre_completo: 'Felipe Morales',   categoria: 'Sub-10', asistencia: 95, numero_camiseta: 10, posicion: 'Delantero',    goles: 15, partidos: 12, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 10, nombre_completo: 'Nicolás Silva',    categoria: 'Sub-10', asistencia: 82, numero_camiseta: 6,  posicion: 'Mediocampista', goles: 4,  partidos: 10, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 11, nombre_completo: 'Agustín Torres',   categoria: 'Sub-8',  asistencia: 88, numero_camiseta: 9,  posicion: 'Delantero',    goles: 9,  partidos: 10, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 12, nombre_completo: 'Emilio Díaz',      categoria: 'Sub-8',  asistencia: 71, numero_camiseta: 2,  posicion: 'Defensa',       goles: 1,  partidos: 8,  matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 13, nombre_completo: 'Sebastián Ramos',  categoria: 'Sub-16', asistencia: 77, numero_camiseta: 7,  posicion: 'Mediocampista', goles: 7,  partidos: 9,  matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 14, nombre_completo: 'Rodrigo Vargas',   categoria: 'Sub-16', asistencia: 84, numero_camiseta: 3,  posicion: 'Defensa',       goles: 2,  partidos: 11, matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
];

export const categorias = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];
export const meses = { 3:'Mar',4:'Abr',5:'May',6:'Jun',7:'Jul',8:'Ago',9:'Sep' };

export const getAlumnosByCategoria = (cat) =>
  alumnos.filter((a) => a.categoria === cat);

export const getIniciales = (nombre) =>
  nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();