import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LoginContextProvider } from './contexts/LoginContextProvider';
import { AlertContextProvider } from './contexts/AlertContextProvider';
import { ThemeContextProvider } from './contexts/ThemeContextProvider';
import { LoadingContextProvider } from './contexts/LoadingContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoadingContextProvider>
    <ThemeContextProvider>
      <AlertContextProvider>
        <LoginContextProvider>
          <App />
        </LoginContextProvider>
      </AlertContextProvider>
    </ThemeContextProvider>
  </LoadingContextProvider>
);

