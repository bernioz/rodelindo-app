import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TutorialContext = createContext(null);

export function TutorialProvider({ children }) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [rolActual, setRolActual] = useState(null);
  const [vistoPorRol, setVistoPorRol] = useState({
    alumno: false,
    profesor: false,
    admin: false,
  });

  // Se activa automáticamente la primera vez que se inicia sesión con cada rol
  useEffect(() => {
    if (user && user.rol && !vistoPorRol[user.rol]) {
      setRolActual(user.rol);
      setVisible(true);
      setVistoPorRol((prev) => ({ ...prev, [user.rol]: true }));
    }
  }, [user]);

  const abrirTutorial = (rolForzado) => {
    const rolObjetivo = rolForzado || user?.rol;
    if (!rolObjetivo) return;
    setRolActual(rolObjetivo);
    setVisible(true);
  };

  const cerrarTutorial = () => {
    setVisible(false);
  };

  return (
    <TutorialContext.Provider value={{ visible, rolActual, abrirTutorial, cerrarTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}