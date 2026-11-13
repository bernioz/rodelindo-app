import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useEventos } from './EventosContext';
import { useAlumnos } from './AlumnosContext';
import {
  planificarRecordatorios, pedirPermiso, sincronizar, cancelarTodo, notificarAhora,
} from '../utils/notificaciones';

const RecordatoriosContext = createContext(null);

// Va DENTRO de Auth, Eventos y Alumnos: lee sus datos y reprograma los avisos cada vez que algo cambia
export function RecordatoriosProvider({ children }) {
  const { user } = useAuth();
  const { eventos } = useEventos();
  const { alumnos, sesiones } = useAlumnos();

  const [activos, setActivos] = useState(true);
  const [estado, setEstado] = useState({ permiso: 'pendiente', programadas: 0, error: false });

  const cola = useRef(Promise.resolve()); // evita que dos reprogramaciones se pisen
  const ultimaFirma = useRef('');
  const usuarioAnterior = useRef(null);

  const alumno = user?.rol === 'alumno' ? alumnos.find((a) => a.id === user.alumnoId) : null;

  const encolar = (tarea) => {
    cola.current = cola.current.then(tarea).catch(() => setEstado((s) => ({ ...s, error: true })));
  };

  useEffect(() => {
    // Al cerrar sesión, se borran los avisos de ese usuario
    if (!user) {
      if (usuarioAnterior.current) {
        encolar(async () => { await cancelarTodo(); setEstado({ permiso: 'pendiente', programadas: 0, error: false }); });
      }
      usuarioAnterior.current = null;
      ultimaFirma.current = '';
      return;
    }
    usuarioAnterior.current = user;

    // El administrador no recibe recordatorios: no se programa nada ni se pide permiso
    if (user.rol !== 'alumno' && user.rol !== 'profesor') {
      ultimaFirma.current = '';
      encolar(async () => { await cancelarTodo(); });
      return;
    }

    if (!activos) {
      ultimaFirma.current = '';
      encolar(async () => { await cancelarTodo(); setEstado((s) => ({ ...s, programadas: 0 })); });
      return;
    }

    const plan = planificarRecordatorios({
      rol: user.rol, categoria: user.categoria, alumno, eventos, sesiones,
    });
    // Si nada cambió, no se reprograma
    const firma = JSON.stringify(plan.map((p) => [p.id, p.fecha ? p.fecha.getTime() : p.weekday, p.titulo, p.cuerpo]));
    if (firma === ultimaFirma.current) return;
    ultimaFirma.current = firma;

    encolar(async () => {
      const permitido = await pedirPermiso();
      if (!permitido) {
        setEstado({ permiso: 'denegado', programadas: 0, error: false });
        return;
      }
      const n = await sincronizar(plan);
      setEstado({ permiso: 'concedido', programadas: n, error: false });
    });
  }, [user, activos, eventos, sesiones, alumno?.pagos]);

  const probar = async () => {
    const permitido = await pedirPermiso();
    if (!permitido) { setEstado((s) => ({ ...s, permiso: 'denegado' })); return false; }
    await notificarAhora('Prueba de notificación', 'Si ves esto, los recordatorios funcionan en este celular ✅');
    return true;
  };

  return (
    <RecordatoriosContext.Provider value={{ activos, setActivos, estado, probar }}>
      {children}
    </RecordatoriosContext.Provider>
  );
}

export function useRecordatorios() {
  return useContext(RecordatoriosContext);
}
