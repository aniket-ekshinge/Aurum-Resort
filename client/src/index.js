import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#F5F0E8',
                border: '1px solid rgba(201,168,76,0.35)',
                borderLeft: '3px solid #C9A84C',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.3px',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#0A0A0A' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
