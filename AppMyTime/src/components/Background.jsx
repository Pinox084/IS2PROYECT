import React from 'react';

const Background = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/fondo4.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -2,
        }}
      ></div>

      {/* Overlay blanco transparente */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)', 
          zIndex: -1,
        }}
      ></div>

      {/* Contenido */}
      <div style={{ zIndex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Background;