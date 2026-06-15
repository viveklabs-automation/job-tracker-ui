// filepath: src/components/shared/QuickAddModal.tsx

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { checkDuplicate } from '../../db/jobs';
import type { EmploymentType, Priority } from '../../types';
import './shared.css';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { statuses, contacts, addJob } = useJobs();

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('');
  const [statusId, setStatusId] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [resumeVersion, setResumeVersion] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [notes, setNotes] = useState('');

  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Reset status select to the first status when database statuses load
  useEffect(() => {
    if (statuses.length > 0 && !statusId) {
      setStatusId(statuses[0].id);
    }
  }, [statuses, statusId]);

  // Async duplicate checker
  useEffect(() => {
    const triggerDuplicateCheck = async () => {
      if (companyName.trim() && jobTitle.trim()) {
        const isDup = await checkDuplicate(companyName, jobTitle);
        setIsDuplicateWarning(isDup);
      } else {
        setIsDuplicateWarning(false);
      }
    };
    triggerDuplicateCheck();
  }, [companyName, jobTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!companyName.trim()) {
      setValidationError('Company Name is required.');
      return;
    }
    if (!jobTitle.trim()) {
      setValidationError('Job Title is required.');
      return;
    }
    if (!statusId) {
      setValidationError('A job status must be selected.');
      return;
    }

    try {
      await addJob({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobUrl: jobUrl.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        employmentType,
        location: location.trim() || undefined,
        salaryRange: salaryRange.trim() || undefined,
        sourcePlatform: sourcePlatform.trim() || undefined,
        statusId,
        priority,
        resumeVersion: resumeVersion.trim() || undefined,
        recruiterId: recruiterId || undefined,
        notes: notes.trim() || undefined
      });

      // Clear fields and close
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setJobDescription('');
      setEmploymentType('Full-time');
      setLocation('');
      setSalaryRange('');
      setSourcePlatform('');
      setPriority('Medium');
      setResumeVersion('');
      setRecruiterId('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to create job:', error);
      setValidationError('An error occurred while saving the job application.');
    }
  };

  return React.createElement(
    'div',
    { className: 'modal-overlay', onClick: onClose },
    React.createElement(
      'div',
      { className: 'modal-content', onClick: (e) => e.stopPropagation() },
      [
        // Header
        React.createElement(
          'div',
          { className: 'modal-header', key: 'header' },
          [
            React.createElement('h2', { className: 'modal-title', key: 'title' }, 'Add Job Application'),
            React.createElement(
              'button',
              { 
                className: 'modal-close-btn', 
                onClick: onClose,
                'aria-label': 'Close dialog',
                key: 'close'
              },
              React.createElement(X, { size: 20 })
            )
          ]
        ),

        // Body Form
        React.createElement(
          'form',
          { onSubmit: handleSubmit, key: 'form' },
          [
            React.createElement(
              'div',
              { className: 'modal-body' },
              [
                // Validation Error
                validationError && React.createElement(
                  'div',
                  { 
                    style: { 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'var(--color-priority-high)', 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      padding: '12px', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem'
                    },
                    key: 'error'
                  },
                  [
                    React.createElement(AlertCircle, { size: 16 }),
                    validationError
                  ]
                ),

                // Duplicate warning
                isDuplicateWarning && React.createElement(
                  'div',
                  { 
                    style: { 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'var(--color-priority-medium)', 
                      backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                      padding: '12px', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem'
                    },
                    key: 'warning'
                  },
                  [
                    React.createElement(AlertCircle, { size: 16 }),
                    'Duplicate Warning: An active application for this job title at this company already exists.'
                  ]
                ),

                // Row 1: Company Name & Job Title
                React.createElement(
                  'div',
                  { className: 'form-row', key: 'row1' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Company Name *'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. Google',
                            value: companyName,
                            onChange: (e) => setCompanyName(e.target.value),
                            required: true
                          }
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Job Title *'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. Senior Frontend Engineer',
                            value: jobTitle,
                            onChange: (e) => setJobTitle(e.target.value),
                            required: true
                          }
                        )
                      ]
                    )
                  ]
                ),

                // Row 2: Status & Priority
                React.createElement(
                  'div',
                  { className: 'form-row', key: 'row2' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Status *'),
                        React.createElement(
                          'select',
                          {
                            className: 'form-select',
                            value: statusId,
                            onChange: (e) => setStatusId(e.target.value)
                          },
                          statuses.map(s => React.createElement('option', { value: s.id, key: s.id }, s.label))
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Priority'),
                        React.createElement(
                          'select',
                          {
                            className: 'form-select',
                            value: priority,
                            onChange: (e) => setPriority(e.target.value as Priority)
                          },
                          [
                            React.createElement('option', { value: 'High' }, '🔥 High'),
                            React.createElement('option', { value: 'Medium' }, '⚡ Medium'),
                            React.createElement('option', { value: 'Low' }, '💤 Low')
                          ]
                        )
                      ]
                    )
                  ]
                ),

                // Row 3: Employment Type & Location
                React.createElement(
                  'div',
                  { className: 'form-row', key: 'row3' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Employment Type'),
                        React.createElement(
                          'select',
                          {
                            className: 'form-select',
                            value: employmentType,
                            onChange: (e) => setEmploymentType(e.target.value as EmploymentType)
                          },
                          [
                            React.createElement('option', { value: 'Full-time' }, 'Full-time'),
                            React.createElement('option', { value: 'Part-time' }, 'Part-time'),
                            React.createElement('option', { value: 'Contract' }, 'Contract'),
                            React.createElement('option', { value: 'Freelance' }, 'Freelance'),
                            React.createElement('option', { value: 'Internship' }, 'Internship')
                          ]
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Location'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. Remote / New York, NY',
                            value: location,
                            onChange: (e) => setLocation(e.target.value)
                          }
                        )
                      ]
                    )
                  ]
                ),

                // Row 4: Salary Range & Source Platform
                React.createElement(
                  'div',
                  { className: 'form-row', key: 'row4' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Salary Range'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. $120,000 - $140,000',
                            value: salaryRange,
                            onChange: (e) => setSalaryRange(e.target.value)
                          }
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Source Platform'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. LinkedIn, Indeed',
                            value: sourcePlatform,
                            onChange: (e) => setSourcePlatform(e.target.value)
                          }
                        )
                      ]
                    )
                  ]
                ),

                // Row 5: Job URL & Resume Version
                React.createElement(
                  'div',
                  { className: 'form-row', key: 'row5' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Job Posting URL'),
                        React.createElement(
                          'input',
                          {
                            type: 'url',
                            className: 'form-input',
                            placeholder: 'https://...',
                            value: jobUrl,
                            onChange: (e) => setJobUrl(e.target.value)
                          }
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Resume Version'),
                        React.createElement(
                          'input',
                          {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'e.g. Resume_V2_2026',
                            value: resumeVersion,
                            onChange: (e) => setResumeVersion(e.target.value)
                          }
                        )
                      ]
                    )
                  ]
                ),

                // Row 6: Recruiter reference
                React.createElement(
                  'div',
                  { className: 'form-group', key: 'row6' },
                  [
                    React.createElement('label', { className: 'form-label' }, 'Assign Recruiter Contact'),
                    React.createElement(
                      'select',
                      {
                        className: 'form-select',
                        value: recruiterId,
                        onChange: (e) => setRecruiterId(e.target.value)
                      },
                      [
                        React.createElement('option', { value: '', key: 'none' }, 'No Recruiter Assigned'),
                        ...contacts.map(c => React.createElement('option', { value: c.id, key: c.id }, `${c.name} (${c.role || 'Contact'} @ ${c.companyName || 'N/A'})`))
                      ]
                    )
                  ]
                ),

                // Notes & Description Textareas
                React.createElement(
                  'div',
                  { className: 'form-group', key: 'description' },
                  [
                    React.createElement('label', { className: 'form-label' }, 'Job Description Summary'),
                    React.createElement(
                      'textarea',
                      {
                        className: 'form-textarea',
                        rows: 3,
                        placeholder: 'Summarize key requirements...',
                        value: jobDescription,
                        onChange: (e) => setJobDescription(e.target.value)
                      }
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  { className: 'form-group', key: 'notes' },
                  [
                    React.createElement('label', { className: 'form-label' }, 'Personal Notes'),
                    React.createElement(
                      'textarea',
                      {
                        className: 'form-textarea',
                        rows: 2,
                        placeholder: 'Add custom notes or next steps...',
                        value: notes,
                        onChange: (e) => setNotes(e.target.value)
                      }
                    )
                  ]
                )
              ]
            ),

            // Footer actions
            React.createElement(
              'div',
              { className: 'modal-footer', key: 'footer' },
              [
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'btn btn-secondary',
                    onClick: onClose,
                    key: 'cancel'
                  },
                  'Cancel'
                ),
                React.createElement(
                  'button',
                  {
                    type: 'submit',
                    className: 'btn btn-primary',
                    key: 'save'
                  },
                  'Save Application'
                )
              ]
            )
          ]
        )
      ]
    )
  );
};
