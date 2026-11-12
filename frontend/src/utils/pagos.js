import { meses } from '../data/mockData';

// Los meses salen de mockData.meses (los 12 del año) para tener una sola fuente de verdad
export const mesActual = () => new Date().getMonth() + 1;

// Meses que ya "vencieron": del 1 hasta el mes actual
export const mesesVencidos = (hasta = mesActual()) =>
  Object.keys(meses).map(Number).filter((m) => m <= hasta);

const cumplido = (v) => v === true || v === 'na';

// Meses vencidos que no están pagados ni marcados "no aplica"
export const mesesAdeudados = (pagos, hasta) =>
  mesesVencidos(hasta).filter((m) => !cumplido(pagos[m]));

// Matrícula automática: "al día" cuando todos los meses hasta hoy están pagados o "no aplica"
export const calcularMatricula = (pagos, hasta) => {
  const vencidos = mesesVencidos(hasta);
  return vencidos.length > 0 && vencidos.every((m) => cumplido(pagos[m]));
};

export const contarPagados = (pagos) => Object.values(pagos).filter((v) => v === true).length;

// Texto corto: "Debe 2 cuotas" / "Debe 1 cuota"
export const textoDeuda = (n) => `Debe ${n} cuota${n === 1 ? '' : 's'}`;

// Alumno nuevo: los meses anteriores a su ingreso no le corresponden → "no aplica"
export const pagosAlumnoNuevo = (hasta = mesActual()) => {
  const pagos = {};
  for (let m = 1; m < hasta; m++) pagos[m] = 'na';
  return pagos;
};
