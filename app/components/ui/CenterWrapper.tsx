import React from 'react';

interface CenterWrapperProps {
  children: React.ReactNode;
  background?: string;
}

export function CenterWrapper({
  children,
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}: CenterWrapperProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}
