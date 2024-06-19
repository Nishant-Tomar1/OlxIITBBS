import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LoginContextProvider } from './contexts/LoginContextProvider';
import { AlertContextProvider } from './contexts/AlertContextProvider';
import { ThemeContextProvider } from './contexts/ThemeContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeContextProvider>
    <AlertContextProvider>
         < LoginContextProvider>
             <App />
        </LoginContextProvider>
    </AlertContextProvider>
    </ThemeContextProvider>
);

