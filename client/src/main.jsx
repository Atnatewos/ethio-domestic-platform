// File path: /client/src/main.jsx
// Purpose: React app entry point - renders the App component
// This is what Vite uses to start the React app

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import global styles
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);