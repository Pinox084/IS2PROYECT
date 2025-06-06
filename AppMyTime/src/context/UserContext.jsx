import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Leer desde localStorage si existe, aplicado para no perder los datos al hacer refresh en la página
    const storedData = localStorage.getItem("userData");
    return storedData
      ? JSON.parse(storedData)
      : {
          name: "",
          email: "",
          phone: "",
          location: "",
        };
  });

  // Guardar en localStorage cada vez que userData cambia
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);