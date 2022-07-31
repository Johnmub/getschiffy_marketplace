import React from 'react';
import ReactDOM from 'react-dom/client';
import './polyfill.ts';
import App from './app/app';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
