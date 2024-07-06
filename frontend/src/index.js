import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LoginContextProvider } from './store/contexts/LoginContextProvider';
import { AlertContextProvider } from './store/contexts/AlertContextProvider';
import { ThemeContextProvider } from './store/contexts/ThemeContextProvider';
import { LoadingContextProvider } from './store/contexts/LoadingContextProvider';
import { SearchContextProvider } from './store/contexts/SearchContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LoadingContextProvider>
        <ThemeContextProvider>
            <AlertContextProvider>
                <SearchContextProvider>
                    <LoginContextProvider>
                        <App />
                    </LoginContextProvider>
                </SearchContextProvider>
            </AlertContextProvider>
        </ThemeContextProvider>
    </LoadingContextProvider>
);

