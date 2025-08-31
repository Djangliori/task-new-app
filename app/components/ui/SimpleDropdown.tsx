'use client';
import { useState, useEffect, useRef } from 'react';

interface SimpleDropdownProps {
  projectId: number;
  projectName: string;
  onDelete: (id: number) => void;
  currentLanguage: 'ka' | 'en';
}

export function SimpleDropdown({
  projectId,
  projectName,
  onDelete,
  currentLanguage,
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
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
            minWidth: '180px',
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
            {projectName}
          </div>
          <button
            onClick={() => {
              onDelete(projectId);
              setIsOpen(false);
            }}
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
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = '#bdc3c7';
            }}
          >
            🗑️ {currentLanguage === 'ka' ? 'წაშლა' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
