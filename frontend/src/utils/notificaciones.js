import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { addDias, fromKey, hoyKey } from './fechas';
import { visiblePara, tituloEvento, detalleEvento } from './eventos';
import { mesesAdeudados, textoDeuda } from './pagos';
import { meses } from '../data/mockData';

const MIN = 60 * 1000;
const MAX_PROGRAMADAS = 50; // iOS permite como máximo 64 notificaciones locales pendientes
export const CANAL = 'recordatorios';

// 'YYYY-MM-DD' + 'HH:MM' → Date en hora local
const aFecha = (key, hora) => {
  const d = fromKey(key);
  const [h, m] = hora.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

const entre = (key, desde, hasta) => key >= desde && key <= hasta;

/**
 * Decide qué recordatorios programar en ESTE celular. No depende de Expo, así que es fácil de probar.
 * Devuelve: [{ id, titulo, cuerpo, tipo: 'fecha', fecha: Date } | { ..., tipo: 'semanal', weekday, hour, minute }]
 */
export const planificarRecordatorios = ({ rol, categoria, alumno, eventos, sesiones = [], ahora = new Date() }) => {
  const hoy = hoyKey();
  const plan = [];

  if (rol === 'alumno') {
    const hasta = addDias(hoy, 14);
    eventos
      .filter((e) => entre(e.fecha, hoy, hasta) && visiblePara(e, categoria))
      .forEach((e) => {
        const detalle = detalleEvento(e) || 'Revisa el calendario';
        if (e.hora) {
          plan.push({
            id: `ev-${e.id}-1h`, tipo: 'fecha',
            fecha: new Date(aFecha(e.fecha, e.hora).getTime() - 60 * MIN),
            titulo: `En 1 hora: ${tituloEvento(e)}`, cuerpo: detalle,
          });
        } else {
          plan.push({
            id: `ev-${e.id}-dia`, tipo: 'fecha', fecha: aFecha(e.fecha, '08:00'),
            titulo: `Hoy: ${tituloEvento(e)}`, cuerpo: detalle,
          });
        }
        // Torneos y reuniones: además, aviso el día anterior
        if (e.tipo === 'Torneo' || e.tipo === 'Partido' || e.tipo === 'Reunión') {
          plan.push({
            id: `ev-${e.id}-vispera`, tipo: 'fecha', fecha: aFecha(addDias(e.fecha, -1), '18:00'),
            titulo: `Mañana: ${tituloEvento(e)}`, cuerpo: detalle,
          });
        }
      });

    // Cuotas pendientes: recordatorio semanal (lunes 10:00) mientras exista deuda
    if (alumno) {
      const adeudados = mesesAdeudados(alumno.pagos);
      if (adeudados.length > 0) {
        plan.push({
          id: 'cuotas-semanal', tipo: 'semanal', weekday: 2, hour: 10, minute: 0, // 2 = lunes
          titulo: 'Cuotas pendientes',
          cuerpo: `${alumno.nombre_completo.split(' ')[0]}: ${textoDeuda(adeudados.length).toLowerCase()} (${adeudados.map((m) => meses[m]).join(', ')}).`,
        });
      }
    }
  }

  if (rol === 'profesor') {
    const hasta = addDias(hoy, 7);
    eventos
      .filter((e) => entre(e.fecha, hoy, hasta) && e.hora)
      .forEach((e) => {
        const inicio = aFecha(e.fecha, e.hora);
        plan.push({
          id: `ev-${e.id}-30m`, tipo: 'fecha', fecha: new Date(inicio.getTime() - 30 * MIN),
          titulo: `En 30 min: ${tituloEvento(e)}`, cuerpo: detalleEvento(e) || 'Revisa el calendario',
        });
        // Clases: 10 min después de empezar, recordar registrar la asistencia si aún no está
        const registrada = sesiones.some((s) => s.categoria === e.categoria && s.fecha === e.fecha);
        if (e.tipo === 'Clase' && !registrada) {
          plan.push({
            id: `asist-${e.id}`, tipo: 'fecha', fecha: new Date(inicio.getTime() + 10 * MIN),
            titulo: 'Registra la asistencia', cuerpo: `${e.categoria} · clase de las ${e.hora}`,
          });
        }
      });
  }

  // Solo futuras; las de fecha primero y ordenadas; tope para no pasar el límite del sistema
  const futuras = plan.filter((p) => p.tipo === 'semanal' || p.fecha.getTime() > ahora.getTime());
  const fijas = futuras.filter((p) => p.tipo === 'semanal');
  const conFecha = futuras.filter((p) => p.tipo === 'fecha').sort((a, b) => a.fecha - b.fecha);
  return [...fijas, ...conFecha.slice(0, MAX_PROGRAMADAS - fijas.length)];
};

// ---------------- Conexión con Expo ----------------

// Cómo se muestran si llegan con la app abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const pedirPermiso = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  return status === 'granted';
};

export const cancelarTodo = () => Notifications.cancelAllScheduledNotificationsAsync();

// Reemplaza TODO lo programado por el plan actual. Devuelve cuántas quedaron programadas.
export const sincronizar = async (plan) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const p of plan) {
    const trigger =
      p.tipo === 'semanal'
        ? { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: p.weekday, hour: p.hour, minute: p.minute, channelId: CANAL }
        : { type: Notifications.SchedulableTriggerInputTypes.DATE, date: p.fecha, channelId: CANAL };
    await Notifications.scheduleNotificationAsync({
      identifier: p.id,
      content: { title: p.titulo, body: p.cuerpo },
      trigger,
    });
  }
  return plan.length;
};

// Notificación inmediata (para probar que el celular las recibe)
export const notificarAhora = (titulo, cuerpo) =>
  Notifications.scheduleNotificationAsync({ content: { title: titulo, body: cuerpo }, trigger: null });
