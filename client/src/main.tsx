import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.tsx';
import Web3Provider from './providers/Web3Provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '16px',
            border: '1px solid rgba(17,17,17,0.08)',
            background: '#111111',
            color: '#ffffff',
            boxShadow: '0 18px 48px rgba(17,17,17,0.18)',
          },
        }}
      />
    </Web3Provider>
  </StrictMode>,
);
