'use client';
import { useState, useEffect, useRef } from 'react';
import { getPriorityColor, getPriorityIcon } from '../../utils/constants';

interface TaskDropdownProps {
  taskId: string;
  taskName: string;
  taskPriority: 'high' | 'medium' | 'low';
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newName: string,
    newPriority: 'high' | 'medium' | 'low'
  ) => void;
  currentLanguage: 'ka' | 'en';
}

export function TaskDropdown({
  taskId,
  taskName,
  taskPriority,
  onDelete,
  onEdit,
  currentLanguage,
}: TaskDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(taskName);
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>(
    taskPriority
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleEdit = () => {
    setShowEditModal(true);
    setIsOpen(false);
  };

  const handleEditSubmit = () => {
    if (editName.trim()) {
      onEdit(taskId, editName.trim(), editPriority);
      setShowEditModal(false);
    }
  };

  const handleDelete = () => {
    onDelete(taskId);
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={dropdownRef}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '8px',
            color: '#95a5a6',
          }}
        >
          ⋯
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              background: '#2c3e50',
              border: '1px solid #34495e',
              borderRadius: '6px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              minWidth: '140px',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid #34495e',
                color: '#ecf0f1',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {taskName.length > 15
                ? taskName.substring(0, 15) + '...'
                : taskName}
            </div>

            <button
              onClick={handleEdit}
              style={{
                width: '100%',
                border: 'none',
                padding: '12px 16px',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#bdc3c7',
                fontSize: '14px',
                borderBottom: '1px solid #34495e',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  '#3498db';
                (e.currentTarget as HTMLButtonElement).style.color = 'white';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'none';
                (e.currentTarget as HTMLButtonElement).style.color = '#bdc3c7';
              }}
            >
              ✏️ {currentLanguage === 'ka' ? 'რედაქტირება' : 'Edit'}
            </button>

            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                border: 'none',
                padding: '12px 16px',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#bdc3c7',
                fontSize: '14px',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  '#e74c3c';
                (e.currentTarget as HTMLButtonElement).style.color = 'white';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'none';
                (e.currentTarget as HTMLButtonElement).style.color = '#bdc3c7';
              }}
            >
              🗑️ {currentLanguage === 'ka' ? 'წაშლა' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
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
        >
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              width: '400px',
              maxWidth: '90vw',
            }}
          >
            <h3
              style={{
                textAlign: 'center',
                color: '#2c3e50',
                marginBottom: '20px',
                fontSize: '20px',
              }}
            >
              {currentLanguage === 'ka' ? 'დავალების რედაქტირება' : 'Edit Task'}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {currentLanguage === 'ka' ? 'დავალების სახელი:' : 'Task Name:'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit()}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                {currentLanguage === 'ka' ? 'პრიორიტეტი:' : 'Priority:'}
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                {(['high', 'medium', 'low'] as const).map((priorityType) => (
                  <button
                    key={priorityType}
                    type="button"
                    onClick={() => setEditPriority(priorityType)}
                    style={{
                      padding: '12px 20px',
                      border:
                        editPriority === priorityType
                          ? `3px solid ${getPriorityColor(priorityType)}`
                          : '2px solid #ddd',
                      borderRadius: '8px',
                      background:
                        editPriority === priorityType
                          ? getPriorityColor(priorityType)
                          : 'white',
                      color:
                        editPriority === priorityType ? 'white' : '#2c3e50',
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
                  >
                    {getPriorityIcon(priorityType)}
                    {priorityType === 'high'
                      ? currentLanguage === 'ka'
                        ? 'მაღალი'
                        : 'High'
                      : priorityType === 'medium'
                        ? currentLanguage === 'ka'
                          ? 'საშუალო'
                          : 'Medium'
                        : currentLanguage === 'ka'
                          ? 'დაბალი'
                          : 'Low'}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!editName.trim()}
                style={{
                  padding: '10px 20px',
                  background: editName.trim() ? '#27ae60' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: editName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {currentLanguage === 'ka' ? 'შენახვა' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
