export const alumnos = [
  { id: 1, nombre_completo: 'Mateo González',    categoria: 'Sub-12', asistencia: 87,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 2, nombre_completo: 'Pablo Herrera',     categoria: 'Sub-12', asistencia: 92,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 3, nombre_completo: 'Cristóbal Rojas',   categoria: 'Sub-12', asistencia: 61,
    matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 4, nombre_completo: 'Lucas Vega',        categoria: 'Sub-12', asistencia: 79,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 5, nombre_completo: 'Diego Muñoz',       categoria: 'Sub-12', asistencia: 55,
    matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 6, nombre_completo: 'Ignacio Pérez',     categoria: 'Sub-14', asistencia: 90,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 7, nombre_completo: 'Bastián Castro',    categoria: 'Sub-14', asistencia: 73,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 8, nombre_completo: 'Tomás Flores',      categoria: 'Sub-14', asistencia: 68,
    matricula: false, pagos: { 3:true,4:false,5:false,6:false,7:false } },
  { id: 9, nombre_completo: 'Felipe Morales',    categoria: 'Sub-10', asistencia: 95,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:true  } },
  { id: 10, nombre_completo: 'Nicolás Silva',    categoria: 'Sub-10', asistencia: 82,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 11, nombre_completo: 'Agustín Torres',   categoria: 'Sub-8',  asistencia: 88,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
  { id: 12, nombre_completo: 'Emilio Díaz',      categoria: 'Sub-8',  asistencia: 71,
    matricula: false, pagos: { 3:true,4:true,5:false,6:false,7:false } },
  { id: 13, nombre_completo: 'Sebastián Ramos',  categoria: 'Sub-16', asistencia: 77,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:false,7:false } },
  { id: 14, nombre_completo: 'Rodrigo Vargas',   categoria: 'Sub-16', asistencia: 84,
    matricula: true,  pagos: { 3:true,4:true,5:true,6:true,7:false } },
];

export const categorias = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];
export const meses = { 3:'Mar',4:'Abr',5:'May',6:'Jun',7:'Jul',8:'Ago',9:'Sep' };

export const getAlumnosByCategoria = (cat) =>
  alumnos.filter((a) => a.categoria === cat);

export const getIniciales = (nombre) =>
  nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
