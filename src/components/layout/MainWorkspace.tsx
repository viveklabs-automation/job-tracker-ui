// filepath: src/components/layout/MainWorkspace.tsx

import React from 'react';
import type { ViewType } from './Sidebar';
import { DashboardView } from '../dashboard/DashboardView';
import { Board } from '../kanban/Board';
import { CalendarView } from '../calendar/CalendarView';
import { Charts } from '../analytics/Charts';
import { ContactsView } from '../contacts/ContactsView';

interface MainWorkspaceProps {
  currentView: ViewType;
  onJobClick: (id: string) => void;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({ currentView, onJobClick }) => {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return React.createElement(DashboardView);
      case 'board':
        return React.createElement(Board, { onJobClick });
      case 'calendar':
        return React.createElement(CalendarView, { onJobClick });
      case 'analytics':
        return React.createElement(Charts);
      case 'contacts':
        return React.createElement(ContactsView);
      default:
        return React.createElement(DashboardView);
    }
  };

  return React.createElement(
    'main',
    { className: 'workspace-container' },
    renderView()
  );
};
export default MainWorkspace;
