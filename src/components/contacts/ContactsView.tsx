// filepath: src/components/contacts/ContactsView.tsx

import React, { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import type { Contact } from '../../types';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  Linkedin, 
  Building2, 
  Trash2, 
  Edit3, 
  X,
  ExternalLink
} from 'lucide-react';
import './contacts.css';
import '../shared/shared.css';

export const ContactsView: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setLinkedIn('');
    setNotes('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setRole(contact.role || '');
    setEmail(contact.email || '');
    setPhone(contact.phone || '');
    setCompanyName(contact.companyName || '');
    setLinkedIn(contact.linkedIn || '');
    setNotes(contact.notes || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }

    try {
      const contactData = {
        name: name.trim(),
        role: role.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        companyName: companyName.trim() || undefined,
        linkedIn: linkedIn.trim() || undefined,
        notes: notes.trim() || undefined
      };

      if (editingContact) {
        await updateContact({
          id: editingContact.id,
          ...contactData
        });
      } else {
        await addContact(contactData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save contact.');
    }
  };

  const handleDelete = async (id: string, contactName: string) => {
    if (window.confirm(`Are you sure you want to delete ${contactName}?`)) {
      await deleteContact(id);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return React.createElement(
    'div',
    { className: 'contacts animate-fade-in' },
    [
      // Header
      React.createElement(
        'div',
        { className: 'contacts__header', key: 'header' },
        [
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' }, key: 'title-container' },
            [
              React.createElement(Users, { className: 'sidebar__nav-icon', style: { color: 'var(--brand-primary)' } }),
              React.createElement('h2', { style: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' } }, 'Recruiters & Contacts')
            ]
          ),
          React.createElement(
            'button',
            {
              className: 'btn btn-primary',
              style: { display: 'flex', gap: '6px', alignItems: 'center' },
              onClick: openAddModal,
              key: 'add-btn'
            },
            [
              React.createElement(Plus, { size: 16 }),
              'Add Contact'
            ]
          )
        ]
      ),

      // Grid list of Contacts
      contacts.length === 0
        ? React.createElement(
            'div',
            { 
              style: { 
                padding: 'var(--space-12)', 
                textAlign: 'center', 
                color: 'var(--text-tertiary)', 
                border: '1px dashed var(--border-color)', 
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-secondary)'
              },
              key: 'empty'
            },
            [
              React.createElement(Users, { size: 48, style: { color: 'var(--text-tertiary)', marginBottom: '16px' } }),
              React.createElement('h3', { style: { fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' } }, 'No contacts logged yet'),
              React.createElement('p', { style: { fontSize: '0.875rem', maxWidth: '320px', margin: '0 auto 16px' } }, 'Keep track of recruiters, hiring managers, and referrers for your applications.'),
              React.createElement(
                'button',
                { className: 'btn btn-primary', onClick: openAddModal },
                'Add Your First Contact'
              )
            ]
          )
        : React.createElement(
            'div',
            { className: 'contacts__grid', key: 'grid' },
            contacts.map(contact => 
              React.createElement(
                'div',
                { className: 'contact-card', key: contact.id },
                [
                  // Card Header
                  React.createElement(
                    'div',
                    { className: 'contact-card__header', key: 'header' },
                    [
                      React.createElement('div', { className: 'contact-card__avatar', key: 'avatar' }, getInitials(contact.name)),
                      React.createElement(
                        'div',
                        { className: 'contact-card__info', key: 'info' },
                        [
                          React.createElement('span', { className: 'contact-card__name' }, contact.name),
                          contact.role && React.createElement('span', { className: 'contact-card__role' }, contact.role)
                        ]
                      )
                    ]
                  ),

                  // Detail Rows
                  React.createElement(
                    'div',
                    { className: 'contact-card__details', key: 'details' },
                    [
                      contact.companyName && React.createElement(
                        'div',
                        { className: 'contact-card__detail-item', key: 'company' },
                        [
                          React.createElement(Building2, { size: 14 }),
                          React.createElement('span', null, contact.companyName)
                        ]
                      ),
                      contact.email && React.createElement(
                        'div',
                        { className: 'contact-card__detail-item', key: 'email' },
                        [
                          React.createElement(Mail, { size: 14 }),
                          React.createElement('a', { href: `mailto:${contact.email}`, className: 'contact-card__detail-link' }, contact.email)
                        ]
                      ),
                      contact.phone && React.createElement(
                        'div',
                        { className: 'contact-card__detail-item', key: 'phone' },
                        [
                          React.createElement(Phone, { size: 14 }),
                          React.createElement('span', null, contact.phone)
                        ]
                      ),
                      contact.linkedIn && React.createElement(
                        'div',
                        { className: 'contact-card__detail-item', key: 'linkedin' },
                        [
                          React.createElement(Linkedin, { size: 14 }),
                          React.createElement(
                            'a',
                            { href: contact.linkedIn, target: '_blank', rel: 'noreferrer', className: 'contact-card__detail-link', style: { display: 'flex', alignItems: 'center', gap: '2px' } },
                            [
                              'LinkedIn Profile',
                              React.createElement(ExternalLink, { size: 10 })
                            ]
                          )
                        ]
                      )
                    ]
                  ),

                  // Notes box
                  contact.notes && React.createElement(
                    'p',
                    { className: 'contact-card__notes', key: 'notes', title: contact.notes },
                    contact.notes
                  ),

                  // Actions
                  React.createElement(
                    'div',
                    { className: 'contact-card__actions', key: 'actions' },
                    [
                      React.createElement(
                        'button',
                        {
                          className: 'contact-card__action-btn',
                          onClick: () => openEditModal(contact),
                          'aria-label': 'Edit contact details',
                          key: 'edit'
                        },
                        React.createElement(Edit3, { size: 14 })
                      ),
                      React.createElement(
                        'button',
                        {
                          className: 'contact-card__action-btn contact-card__action-btn--delete',
                          onClick: () => handleDelete(contact.id, contact.name),
                          'aria-label': 'Delete contact',
                          key: 'delete'
                        },
                        React.createElement(Trash2, { size: 14 })
                      )
                    ]
                  )
                ]
              )
            )
          ),

      // Contact Form Modal
      isModalOpen && React.createElement(
        'div',
        { className: 'modal-overlay', onClick: () => setIsModalOpen(false), key: 'modal' },
        React.createElement(
          'div',
          { className: 'modal-content', onClick: (e) => e.stopPropagation() },
          [
            // Header
            React.createElement(
              'div',
              { className: 'modal-header', key: 'header' },
              [
                React.createElement(
                  'h2',
                  { className: 'modal-title', key: 'title' },
                  editingContact ? 'Edit Contact Details' : 'Add Recruiter Contact'
                ),
                React.createElement(
                  'button',
                  { className: 'modal-close-btn', onClick: () => setIsModalOpen(false) },
                  React.createElement(X, { size: 20 })
                )
              ]
            ),

            // Form
            React.createElement(
              'form',
              { onSubmit: handleSave, key: 'form' },
              [
                React.createElement(
                  'div',
                  { className: 'modal-body' },
                  [
                    errorMsg && React.createElement('div', { style: { color: 'var(--color-priority-high)', fontSize: '0.875rem' } }, errorMsg),
                    
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'name' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Full Name *'),
                        React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. Jane Doe', value: name, onChange: (e) => setName(e.target.value), required: true })
                      ]
                    ),

                    React.createElement(
                      'div',
                      { className: 'form-row', key: 'row1' },
                      [
                        React.createElement(
                          'div',
                          { className: 'form-group' },
                          [
                            React.createElement('label', { className: 'form-label' }, 'Role / Title'),
                            React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. Tech Recruiter', value: role, onChange: (e) => setRole(e.target.value) })
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: 'form-group' },
                          [
                            React.createElement('label', { className: 'form-label' }, 'Company Name'),
                            React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. Google', value: companyName, onChange: (e) => setCompanyName(e.target.value) })
                          ]
                        )
                      ]
                    ),

                    React.createElement(
                      'div',
                      { className: 'form-row', key: 'row2' },
                      [
                        React.createElement(
                          'div',
                          { className: 'form-group' },
                          [
                            React.createElement('label', { className: 'form-label' }, 'Email address'),
                            React.createElement('input', { type: 'email', className: 'form-input', placeholder: 'name@company.com', value: email, onChange: (e) => setEmail(e.target.value) })
                          ]
                        ),
                        React.createElement(
                          'div',
                          { className: 'form-group' },
                          [
                            React.createElement('label', { className: 'form-label' }, 'Phone Number'),
                            React.createElement('input', { type: 'tel', className: 'form-input', placeholder: '+1 (555) 019-2834', value: phone, onChange: (e) => setPhone(e.target.value) })
                          ]
                        )
                      ]
                    ),

                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'linkedin' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'LinkedIn Profile URL'),
                        React.createElement('input', { type: 'url', className: 'form-input', placeholder: 'https://linkedin.com/in/...', value: linkedIn, onChange: (e) => setLinkedIn(e.target.value) })
                      ]
                    ),

                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'notes' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Contact Notes'),
                        React.createElement('textarea', { className: 'form-textarea', rows: 3, placeholder: 'Met during conference, referred for UI role...', value: notes, onChange: (e) => setNotes(e.target.value) })
                      ]
                    )
                  ]
                ),

                React.createElement(
                  'div',
                  { className: 'modal-footer', key: 'footer' },
                  [
                    React.createElement('button', { type: 'button', className: 'btn btn-secondary', onClick: () => setIsModalOpen(false) }, 'Cancel'),
                    React.createElement('button', { type: 'submit', className: 'btn btn-primary' }, 'Save Contact')
                  ]
                )
              ]
            )
          ]
        )
      )
    ]
  );
};
export default ContactsView;
