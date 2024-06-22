import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LoginContextProvider } from './store/contexts/LoginContextProvider';
import { AlertContextProvider } from './store/contexts/AlertContextProvider';
import { ThemeContextProvider } from './store/contexts/ThemeContextProvider';
import { LoadingContextProvider } from './store/contexts/LoadingContextProvider';

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

