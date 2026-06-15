// filepath: src/components/shared/SearchBar.tsx

import React from 'react';
import { Search, X } from 'lucide-react';
import './shared.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search jobs by title, company, notes..." 
}) => {
  return React.createElement(
    'div',
    { className: 'search-bar' },
    [
      React.createElement(Search, { className: 'search-bar__icon', size: 18, key: 'search-icon' }),
      React.createElement(
        'input',
        {
          key: 'search-input',
          type: 'text',
          className: 'search-bar__input',
          value: value,
          onChange: (e) => onChange(e.target.value),
          placeholder: placeholder,
          'aria-label': 'Search jobs'
        }
      ),
      value && React.createElement(
        'button',
        {
          key: 'clear-btn',
          className: 'search-bar__clear',
          onClick: () => onChange(''),
          'aria-label': 'Clear search'
        },
        React.createElement(X, { size: 14 })
      )
    ]
  );
};
