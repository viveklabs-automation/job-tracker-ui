// filepath: src/components/layout/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Trello, 
  Calendar, 
  BarChart3, 
  Users, 
  Sun, 
  Moon, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './layout.css';

export type ViewType = 'dashboard' | 'board' | 'calendar' | 'analytics' | 'contacts';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'board' as ViewType, label: 'Kanban Board', icon: Trello },
    { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'contacts' as ViewType, label: 'Contacts', icon: Users }
  ];

  return React.createElement(
    'aside',
    { className: `sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}` },
    [
      React.createElement(
        'div',
        { className: 'sidebar__header', key: 'header' },
        [
          React.createElement(
            'div',
            { className: 'sidebar__logo-wrapper', key: 'logo-wrap' },
            [
              React.createElement(
                'div',
                { className: 'sidebar__logo-icon', key: 'logo' },
                React.createElement(Briefcase, { size: 18 })
              ),
              React.createElement(
                'h1',
                { className: 'sidebar__logo-text', key: 'title' },
                'JobOrbit'
              )
            ]
          ),
          React.createElement(
            'button',
            {
              className: 'sidebar__collapse-btn',
              onClick: onToggleCollapse,
              'aria-label': isCollapsed ? 'Expand sidebar' : 'Collapse sidebar',
              title: isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar',
              key: 'collapse-btn'
            },
            React.createElement(isCollapsed ? ChevronRight : ChevronLeft, { size: 16 })
          )
        ]
      ),
      React.createElement(
        'nav',
        { className: 'sidebar__nav', key: 'nav' },
        navItems.map(item => {
          const isActive = currentView === item.id;
          return React.createElement(
            'button',
            {
              key: item.id,
              className: `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`,
              onClick: () => onViewChange(item.id),
              'aria-label': `Navigate to ${item.label}`,
              'aria-current': isActive ? 'page' : undefined
            },
            [
              React.createElement(item.icon, { className: 'sidebar__nav-icon', key: 'icon' }),
              React.createElement('span', { key: 'label' }, item.label)
            ]
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'sidebar__footer', key: 'footer' },
        React.createElement(
          'button',
          {
            className: 'sidebar__theme-toggle',
            onClick: toggleTheme,
            'aria-label': `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
          },
          [
            React.createElement(theme === 'light' ? Moon : Sun, { size: 16, key: 'theme-icon' }),
            React.createElement('span', { key: 'theme-text' }, theme === 'light' ? 'Dark Mode' : 'Light Mode')
          ]
        )
      )
    ]
  );
};
