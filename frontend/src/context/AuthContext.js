import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    // Por ahora sin backend — usuarios hardcodeados para probar
    const usuarios = {
      alumno: { nombre: 'Mateo López', rol: 'alumno', categoria: 'Sub-12' },
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
