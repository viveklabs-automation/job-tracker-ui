// filepath: src/App.tsx

import React, { useState } from 'react';
import { JobsProvider } from './hooks/useJobs';
import { Sidebar } from './components/layout/Sidebar';
import type { ViewType } from './components/layout/Sidebar';
import { MainWorkspace } from './components/layout/MainWorkspace';
import { InsightsPanel } from './components/layout/InsightsPanel';
import { QuickAddFAB } from './components/shared/QuickAddFAB';
import { QuickAddModal } from './components/shared/QuickAddModal';
import { Drawer } from './components/jobDetail/Drawer';
import { Sparkles } from 'lucide-react';
import './styles/global.css';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  // Collapse Panel States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(false);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
  };

  return React.createElement(
    'div',
    { className: 'app-container' },
    [
      // Sidebar (Navigation & Theme controls)
      React.createElement(Sidebar, {
        currentView,
        onViewChange: setCurrentView,
        isCollapsed: isSidebarCollapsed,
        onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed),
        key: 'sidebar'
      }),

      // Middle workspace content pane
      React.createElement(MainWorkspace, {
        currentView,
        onJobClick: handleJobClick,
        key: 'workspace'
      }),

      // Sidebar widgets panel (Notifications & Stats)
      React.createElement(InsightsPanel, {
        isCollapsed: isInsightsCollapsed,
        onToggleCollapse: () => setIsInsightsCollapsed(!isInsightsCollapsed),
        key: 'insights'
      }),

      // Floating insights expand button when insights panel is collapsed
      isInsightsCollapsed && React.createElement(
        'button',
        {
          className: 'insights-toggle-btn',
          onClick: () => setIsInsightsCollapsed(false),
          'aria-label': 'Expand insights panel',
          title: 'Expand Insights',
          key: 'insights-expand'
        },
        React.createElement(Sparkles, { size: 16 })
      ),

      // Floating Add button
      React.createElement(QuickAddFAB, {
        onClick: () => setIsQuickAddOpen(true),
        key: 'fab'
      }),

      // Add application modal dialog
      React.createElement(QuickAddModal, {
        isOpen: isQuickAddOpen,
        onClose: () => setIsQuickAddOpen(false),
        key: 'quick-add'
      }),

      // Slide out details drawer
      selectedJobId && React.createElement(Drawer, {
        jobId: selectedJobId,
        onClose: handleCloseDrawer,
        key: 'job-detail'
      })
    ]
  );
};

export const App: React.FC = () => {
  return React.createElement(
    JobsProvider,
    null,
    React.createElement(AppContent)
  );
};

export default App;
