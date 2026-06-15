// filepath: src/components/jobDetail/Drawer.tsx

import React, { useState, useEffect } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Timeline } from './Timeline';
import { 
  X, 
  Trash2, 
  Archive, 
  ExternalLink, 
  CheckSquare, 
  Plus, 
  AlertCircle
} from 'lucide-react';
import type { EmploymentType, Priority, StatusHistoryEntry } from '../../types';
import './jobDetail.css';

interface DrawerProps {
  jobId: string | null;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ jobId, onClose }) => {
  const { 
    jobs, 
    statuses, 
    contacts, 
    tasks, 
    updateJob, 
    deleteJob, 
    addTask, 
    toggleTask, 
    deleteTask 
  } = useJobs();

  // Find active job
  const job = jobs.find(j => j.id === jobId);

  // Form states
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

  // Status transition note state
  const [statusNote, setStatusNote] = useState('');
  const [prevStatusId, setPrevStatusId] = useState('');

  // Add Task linked to this job
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Populate form when job changes
  useEffect(() => {
    if (job) {
      setCompanyName(job.companyName);
      setJobTitle(job.jobTitle);
      setJobUrl(job.jobUrl || '');
      setJobDescription(job.jobDescription || '');
      setEmploymentType(job.employmentType || 'Full-time');
      setLocation(job.location || '');
      setSalaryRange(job.salaryRange || '');
      setSourcePlatform(job.sourcePlatform || '');
      setStatusId(job.statusId);
      setPrevStatusId(job.statusId);
      setPriority(job.priority);
      setResumeVersion(job.resumeVersion || '');
      setRecruiterId(job.recruiterId || '');
      setNotes(job.notes || '');
      setStatusNote(''); // Reset status note
    }
  }, [job, jobId]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && jobId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jobId, onClose]);

  if (!job) return null;

  const handleSave = async () => {
    let updatedHistory = [...(job.statusHistory || [])];
    
    // Check if status changed
    if (statusId !== prevStatusId) {
      const historyEntry: StatusHistoryEntry = {
        statusId,
        changedAt: Date.now(),
        note: statusNote.trim() || undefined
      };
      updatedHistory.push(historyEntry);
    }

    await updateJob({
      ...job,
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
      notes: notes.trim() || undefined,
      statusHistory: updatedHistory
    });

    setPrevStatusId(statusId);
    setStatusNote('');
  };

  const handleToggleArchive = async () => {
    await updateJob({
      ...job,
      isArchived: !job.isArchived
    });
  };

  const handleDeleteJob = async () => {
    if (window.confirm(`Are you sure you want to delete the job application for ${job.jobTitle} @ ${job.companyName}?`)) {
      await deleteJob(job.id);
      onClose();
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle.trim(),
      jobId: job.id
    });
    setNewTaskTitle('');
  };

  const jobTasks = tasks.filter(t => t.jobId === job.id);

  return React.createElement(
    'div',
    { className: 'drawer-backdrop', onClick: onClose },
    React.createElement(
      'div',
      { className: 'drawer', onClick: (e) => e.stopPropagation() },
      [
        // Header
        React.createElement(
          'div',
          { className: 'drawer__header', key: 'header' },
          [
            React.createElement(
              'div',
              { key: 'title-container' },
              [
                React.createElement('span', { style: { fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 } }, 'Job Details'),
                React.createElement('h3', { className: 'drawer__header-title' }, `${companyName} — ${jobTitle}`)
              ]
            ),
            React.createElement(
              'button',
              { 
                className: 'modal-close-btn', 
                onClick: onClose,
                'aria-label': 'Close detail panel',
                key: 'close'
              },
              React.createElement(X, { size: 20 })
            )
          ]
        ),

        // Body
        React.createElement(
          'div',
          { className: 'drawer__body', key: 'body' },
          [
            // duplicate alert
            job.isDuplicate && React.createElement(
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
                  fontSize: '0.825rem'
                },
                key: 'dup-alert'
              },
              [
                React.createElement(AlertCircle, { size: 16 }),
                'This application is flagged as a duplicate (company and title match another active entry).'
              ]
            ),

            // Section 1: Core details Form
            React.createElement(
              'div',
              { className: 'drawer__section', key: 'sec-core' },
              [
                React.createElement('h4', { className: 'drawer__section-title' }, 'Application Details'),
                React.createElement(
                  'div',
                  { className: 'drawer__grid' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'company' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Company'),
                        React.createElement('input', { type: 'text', className: 'form-input', value: companyName, onChange: (e) => setCompanyName(e.target.value), onBlur: handleSave })
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'title' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Job Title'),
                        React.createElement('input', { type: 'text', className: 'form-input', value: jobTitle, onChange: (e) => setJobTitle(e.target.value), onBlur: handleSave })
                      ]
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  { className: 'drawer__grid', style: { marginTop: '12px' } },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'status' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Current Status'),
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
                      { className: 'form-group', key: 'priority' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Priority'),
                        React.createElement(
                          'select',
                          { 
                            className: 'form-select', 
                            value: priority, 
                            onChange: (e) => {
                              setPriority(e.target.value as Priority);
                            },
                            onBlur: handleSave
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

                // Note block if status was changed
                statusId !== prevStatusId && React.createElement(
                  'div',
                  { 
                    style: { 
                      marginTop: '12px', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      padding: '12px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    },
                    key: 'status-change'
                  },
                  [
                    React.createElement('span', { style: { fontSize: '11px', fontWeight: 600, color: 'var(--brand-primary)' } }, 'Add Status Change Note (Optional)'),
                    React.createElement(
                      'input',
                      {
                        type: 'text',
                        className: 'form-input',
                        placeholder: 'e.g. Schedule was confirmed for Thursday...',
                        value: statusNote,
                        onChange: (e) => setStatusNote(e.target.value)
                      }
                    ),
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'btn btn-primary',
                        style: { padding: '4px 12px', alignSelf: 'flex-end', fontSize: '11px' },
                        onClick: handleSave
                      },
                      'Save Status Update'
                    )
                  ]
                )
              ]
            ),

            // Section 2: Metadata
            React.createElement(
              'div',
              { className: 'drawer__section', key: 'sec-meta' },
              [
                React.createElement('h4', { className: 'drawer__section-title' }, 'Metadata & Salary'),
                React.createElement(
                  'div',
                  { className: 'drawer__grid' },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'type' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Employment Type'),
                        React.createElement(
                          'select',
                          { className: 'form-select', value: employmentType, onChange: (e) => setEmploymentType(e.target.value as EmploymentType), onBlur: handleSave },
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
                      { className: 'form-group', key: 'loc' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Location'),
                        React.createElement('input', { type: 'text', className: 'form-input', value: location, onChange: (e) => setLocation(e.target.value), onBlur: handleSave })
                      ]
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  { className: 'drawer__grid', style: { marginTop: '12px' } },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'salary' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Salary / Budget'),
                        React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. $100k-$120k', value: salaryRange, onChange: (e) => setSalaryRange(e.target.value), onBlur: handleSave })
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'platform' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Source Platform'),
                        React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. LinkedIn', value: sourcePlatform, onChange: (e) => setSourcePlatform(e.target.value), onBlur: handleSave })
                      ]
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  { className: 'drawer__grid', style: { marginTop: '12px' } },
                  [
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'resume' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Resume Version'),
                        React.createElement('input', { type: 'text', className: 'form-input', placeholder: 'e.g. v1.4', value: resumeVersion, onChange: (e) => setResumeVersion(e.target.value), onBlur: handleSave })
                      ]
                    ),
                    React.createElement(
                      'div',
                      { className: 'form-group', key: 'recruiter' },
                      [
                        React.createElement('label', { className: 'form-label' }, 'Contact Person'),
                        React.createElement(
                          'select',
                          { className: 'form-select', value: recruiterId, onChange: (e) => setRecruiterId(e.target.value), onBlur: handleSave },
                          [
                            React.createElement('option', { value: '', key: 'none' }, 'None'),
                            ...contacts.map(c => React.createElement('option', { value: c.id, key: c.id }, c.name))
                          ]
                        )
                      ]
                    )
                  ]
                ),
                jobUrl && React.createElement(
                  'div',
                  { style: { marginTop: '16px' }, key: 'url' },
                  React.createElement(
                    'a',
                    { href: jobUrl, target: '_blank', rel: 'noreferrer', className: 'drawer__link-icon' },
                    [
                      React.createElement(ExternalLink, { size: 14 }),
                      'Open Original Job Posting'
                    ]
                  )
                )
              ]
            ),

            // Section 3: Tasks
            React.createElement(
              'div',
              { className: 'drawer__section', key: 'sec-tasks' },
              [
                React.createElement('h4', { className: 'drawer__section-title' }, 'Action Checklist'),
                
                // Linked Tasks list
                React.createElement(
                  'div',
                  { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                  jobTasks.length === 0
                    ? React.createElement('span', { style: { fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' } }, 'No tasks for this application yet.')
                    : jobTasks.map(t => 
                        React.createElement(
                          'div',
                          { 
                            key: t.id, 
                            style: { 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              backgroundColor: 'var(--bg-tertiary)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)'
                            } 
                          },
                          [
                            React.createElement(
                              'div',
                              { 
                                style: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 },
                                key: 'label-group' 
                              },
                              [
                                React.createElement(
                                  'button',
                                  {
                                    onClick: () => toggleTask(t.id),
                                    style: { 
                                      color: t.isDone ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                                      cursor: 'pointer'
                                    },
                                    'aria-label': t.isDone ? 'Mark incomplete' : 'Mark complete',
                                    key: 'toggle'
                                  },
                                  React.createElement(CheckSquare, { size: 16 })
                                ),
                                React.createElement(
                                  'span', 
                                  { 
                                    style: { 
                                      textDecoration: t.isDone ? 'line-through' : 'none',
                                      color: t.isDone ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                      fontSize: '0.875rem'
                                    } 
                                  }, 
                                  t.title
                                )
                              ]
                            ),
                            React.createElement(
                              'button',
                              { 
                                onClick: () => deleteTask(t.id),
                                style: { color: 'var(--text-tertiary)', cursor: 'pointer' },
                                'aria-label': 'Delete task',
                                key: 'delete'
                              },
                              React.createElement(Trash2, { size: 14 })
                            )
                          ]
                        )
                      )
                ),

                // Quick Add task for this job
                React.createElement(
                  'form',
                  { onSubmit: handleAddTask, style: { display: 'flex', gap: '8px', marginTop: '12px' } },
                  [
                    React.createElement(
                      'input',
                      {
                        type: 'text',
                        className: 'form-input',
                        placeholder: 'New follow-up task...',
                        value: newTaskTitle,
                        onChange: (e) => setNewTaskTitle(e.target.value),
                        style: { padding: '6px 12px', fontSize: '0.85rem' }
                      }
                    ),
                    React.createElement(
                      'button',
                      { 
                        type: 'submit', 
                        className: 'btn btn-primary', 
                        style: { padding: '6px 12px', fontSize: '0.85rem' } 
                      },
                      React.createElement(Plus, { size: 16 })
                    )
                  ]
                )
              ]
            ),

            // Section 4: Notes
            React.createElement(
              'div',
              { className: 'drawer__section', key: 'sec-notes' },
              [
                React.createElement('h4', { className: 'drawer__section-title' }, 'Notes'),
                React.createElement(
                  'textarea',
                  {
                    className: 'form-textarea',
                    rows: 4,
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    onBlur: handleSave,
                    placeholder: 'Type general notes here...'
                  }
                )
              ]
            ),

            // Section 5: Timeline history
            React.createElement(
              'div',
              { className: 'drawer__section', key: 'sec-timeline' },
              [
                React.createElement('h4', { className: 'drawer__section-title' }, 'Status Progress History'),
                React.createElement(Timeline, { history: job.statusHistory || [], statuses: statuses })
              ]
            )
          ]
        ),

        // Footer Actions
        React.createElement(
          'div',
          { className: 'drawer__footer', key: 'footer' },
          [
            React.createElement(
              'button',
              {
                className: 'btn btn-secondary',
                style: { display: 'flex', gap: '6px', alignItems: 'center' },
                onClick: handleToggleArchive,
                key: 'archive'
              },
              [
                React.createElement(Archive, { size: 16 }),
                job.isArchived ? 'Activate App' : 'Archive App'
              ]
            ),
            React.createElement(
              'button',
              {
                className: 'btn btn-danger',
                style: { display: 'flex', gap: '6px', alignItems: 'center' },
                onClick: handleDeleteJob,
                key: 'delete'
              },
              [
                React.createElement(Trash2, { size: 16 }),
                'Delete Application'
              ]
            )
          ]
        )
      ]
    )
  );
};
export default Drawer;
