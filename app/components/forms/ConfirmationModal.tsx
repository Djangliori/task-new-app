'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmBg: '#e74c3c',
          confirmHover: '#c0392b',
        };
      case 'warning':
        return {
          confirmBg: '#f39c12',
          confirmHover: '#e67e22',
        };
      case 'info':
        return {
          confirmBg: '#3498db',
          confirmHover: '#2980b9',
        };
      default:
        return {
          confirmBg: '#e74c3c',
          confirmHover: '#c0392b',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3
            style={{
              color: '#2c3e50',
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: '700',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: '#495057',
              fontSize: '16px',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 20px',
              background: '#f8f9fa',
              color: '#6c757d',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = '#f8f9fa';
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: '12px 20px',
              background: styles.confirmBg,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 12px ${styles.confirmBg}30`,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = styles.confirmHover;
              (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = styles.confirmBg;
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}