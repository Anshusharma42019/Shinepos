import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ModuleProvider } from './context/ModuleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModuleProvider>
      <App />
    </ModuleProvider>
  </React.StrictMode>,
);
