'use client';

import { useState } from 'react';
import { DatePicker } from '../ui/DatePicker';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskName: string, priority: 'high' | 'medium' | 'low', dueDate?: Date | null) => void;
  currentLanguage: 'ka' | 'en';
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  currentLanguage,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const translations = {
    ka: {
      addTask: 'დავალების დამატება',
      taskName: 'დავალების სახელი:',
      taskNamePlaceholder: 'შეიყვანეთ დავალების სახელი',
      priority: 'პრიორიტეტი:',
      high: 'მაღალი',
      medium: 'საშუალო',
      low: 'დაბალი',
      dueDate: 'დამთავრების თარიღი:',
      create: 'შექმნა',
      cancel: 'გაუქმება',
    },
    en: {
      addTask: 'Add Task',
      taskName: 'Task Name:',
      taskNamePlaceholder: 'Enter task name',
      priority: 'Priority:',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      dueDate: 'Due Date:',
      create: 'Create',
      cancel: 'Cancel',
    },
  };

  const t = (key: keyof typeof translations.ka) =>
    translations[currentLanguage][key];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onSubmit(taskName.trim(), priority, dueDate);
      setTaskName('');
      setPriority('medium');
      setDueDate(null);
      onClose();
    }
  };

  const getPriorityColor = (priorityType: 'high' | 'medium' | 'low') => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#2ecc71',
    };
    return colors[priorityType] || '#95a5a6';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          width: '450px',
          maxWidth: '90vw',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '30px',
            fontSize: '24px',
            fontWeight: '700',
          }}
        >
          {t('addTask')}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              {t('taskName')}
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t('taskNamePlaceholder')}
              autoFocus
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = '#667eea')
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = '#e9ecef')
              }
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '12px',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              {t('priority')}
            </label>

            <div
              style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
            >
              {(['high', 'medium', 'low'] as const).map((priorityType) => (
                <button
                  key={priorityType}
                  type="button"
                  onClick={() => setPriority(priorityType)}
                  style={{
                    padding: '12px 20px',
                    border:
                      priority === priorityType
                        ? `3px solid ${getPriorityColor(priorityType)}`
                        : '2px solid #ddd',
                    borderRadius: '8px',
                    background:
                      priority === priorityType
                        ? getPriorityColor(priorityType)
                        : 'white',
                    color: priority === priorityType ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (priority !== priorityType) {
                      (e.target as HTMLButtonElement).style.borderColor =
                        getPriorityColor(priorityType);
                    }
                  }}
                  onMouseOut={(e) => {
                    if (priority !== priorityType) {
                      (e.target as HTMLButtonElement).style.borderColor =
                        '#ddd';
                    }
                  }}
                >
                  {priorityType === 'high' && '🚩'}
                  {priorityType === 'medium' && '⚠️'}
                  {priorityType === 'low' && '🟢'}
                  {t(priorityType)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              currentLanguage={currentLanguage}
              label={t('dueDate')}
            />
          </div>

          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!taskName.trim()}
              style={{
                padding: '12px 24px',
                background: taskName.trim() ? '#27ae60' : '#bdc3c7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: taskName.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
