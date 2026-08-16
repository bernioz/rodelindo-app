import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    const usuarios = {
      alumno: { nombre: 'Mateo González', rol: 'alumno', categoria: 'Sub-12', alumnoId: 1 },
      profesor: { nombre: 'Prof. Rodrigo Vera', rol: 'profesor', categoria: null },
    };
    setUser(usuarios[role]);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
