import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Activities from '../pages/activities';
import Time from '../pages/time';
import UserInfoPage from '../pages/UserInfoPage';
import LoginPage from '../pages/LoginPage';
import RegistroForm from '../pages/user'; // Importa la página de registro

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/time" element={<Time />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/user" element={<UserInfoPage />} /> {/* Información del usuario */}
      <Route path="/register" element={<RegistroForm />} /> {/* Registro */}
    </Routes>
  );
};

export default AppRoutes;