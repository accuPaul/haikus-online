import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='/*' element={<App/>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
