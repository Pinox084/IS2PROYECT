// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import CustomAppBar from './components/CustomAppBar';
import Footer from './components/Footer';
import Background from './components/Background';
import { UserProvider } from './context/UserContext'; // <-- Importa UserProvider

const AppContent = () => {
  const location = useLocation();

  // Verifica si la ruta actual es la página de login o registro
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <Background>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Muestra la barra de navegación solo si no estás en las páginas de login o registro */}
        {!isAuthPage && <CustomAppBar />}

        {/* Contenido principal */}
        <div style={{ flex: 1, width: '100%' }}>
          <AppRoutes />
        </div>

        {/* Muestra el footer solo si no estás en las páginas de login o registro */}
        {!isAuthPage && <Footer />}
      </div>
    </Background>
  );
};

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <UserProvider> {/* <-- Envuelve AppContent con UserProvider para que el contexto sea accesible */}
        <AppContent />
      </UserProvider>
    </Router>
  );
};

export default App;