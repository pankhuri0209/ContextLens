import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectsDashboard } from './screens/ProjectsDashboard';
import { ProjectWorkspace } from './screens/ProjectWorkspace';
import { Dashboard } from './screens/Dashboard';
import { ReadingInterface } from './screens/ReadingInterface';
import { EnhancedReadingInterface } from './screens/EnhancedReadingInterface';
import { ReadingQueueScreen } from './screens/ReadingQueueScreen';
import { GraphView } from './screens/GraphView';
import { ExportView } from './screens/ExportView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsDashboard />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
        <Route path="/project/:id" element={<ProjectWorkspace />} />
        <Route path="/project/:projectId/read/:paperId" element={<EnhancedReadingInterface />} />
        <Route path="/project/:projectId/queue" element={<ReadingQueueScreen />} />
        <Route path="/project/:projectId/graph/:paperId" element={<GraphView />} />
        <Route path="/papers" element={<Dashboard />} />
        <Route path="/reader/:id" element={<ReadingInterface />} />
        <Route path="/graph/:id" element={<GraphView />} />
        <Route path="/export/:id" element={<ExportView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}