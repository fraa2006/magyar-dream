import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import App from './App.jsx';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
