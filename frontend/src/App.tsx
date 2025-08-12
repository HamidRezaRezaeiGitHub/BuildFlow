import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Estimates from '@/pages/Estimates';
import Catalog from '@/pages/Catalog';
import Settings from '@/pages/Settings';
import '@/styles/globals.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="estimates" element={<Estimates />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
