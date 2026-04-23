import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreatePlan from './pages/CreatePlan';
import Timetable from './pages/Timetable';
import Heatmap from './pages/Heatmap';
import Revision from './pages/Revision';
import Allocation from './pages/Allocation';
import Progress from './pages/Progress';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import WatchNode from './pages/WatchNode';
import KnowledgeTree from './pages/KnowledgeTree';
import { StudyProvider } from './context/StudyContext';

function App() {
  return (
    <StudyProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/watch" element={<WatchNode />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/knowledge-tree" element={<KnowledgeTree />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </StudyProvider>
  );
}

export default App;
