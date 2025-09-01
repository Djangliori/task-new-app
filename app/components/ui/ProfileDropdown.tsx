'use client';
import { useState, useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  userEmail?: string;
  onLogout: () => void;
  currentLanguage: 'ka' | 'en';
  t: (key: string) => string;
}

export function ProfileDropdown({
  userEmail,
  onLogout,
  currentLanguage,
  t,
}: ProfileDropdownProps) {
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
      <div
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          backgroundColor: isOpen ? '#34495e' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        <span className="profile-initials">👤</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: '#2c3e50',
            border: '1px solid #34495e',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '200px',
            zIndex: 9999,
            marginTop: '8px',
          }}
        >
          {userEmail && (
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #34495e',
                color: '#bdc3c7',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {userEmail}
            </div>
          )}
          <button
            onClick={() => {
              onLogout();
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                '#34495e';
              (e.currentTarget as HTMLButtonElement).style.color = '#ecf0f1';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = '#bdc3c7';
            }}
          >
            🚪 {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}