// filepath: src/components/shared/QuickAddFAB.tsx

import React from 'react';
import { Plus } from 'lucide-react';
import './shared.css';

interface QuickAddFABProps {
  onClick: () => void;
}

export const QuickAddFAB: React.FC<QuickAddFABProps> = ({ onClick }) => {
  return React.createElement(
    'button',
    {
      className: 'quick-add-fab',
      onClick: onClick,
      'aria-label': 'Quick add new job application',
      title: 'Add Job Application'
    },
    React.createElement(Plus, { size: 24 })
  );
};
