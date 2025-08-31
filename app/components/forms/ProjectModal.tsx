'use client';

import { UnifiedForm, UnifiedInput, UnifiedButton } from '../ui/UnifiedForm';

interface ProjectModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  projectName: string;
  currentLanguage: 'ka' | 'en';
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onProjectNameChange: (value: string) => void;
  t: (key: string) => string;
}

export function ProjectModal({
  isOpen,
  mode,
  projectName,
  currentLanguage,
  onClose,
  onSubmit,
  onProjectNameChange,
  t,
}: ProjectModalProps) {
  if (!isOpen) return null;

  const title = mode === 'create' ? t('createProject') : t('editProject');
  const submitText =
    mode === 'create'
      ? currentLanguage === 'ka'
        ? 'შექმნა'
        : 'Create'
      : currentLanguage === 'ka'
        ? 'შენახვა'
        : 'Save';

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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <UnifiedForm title={title} onSubmit={onSubmit}>
        <UnifiedInput
          label={currentLanguage === 'ka' ? 'პროექტის სახელი' : 'Project Name'}
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder={
            currentLanguage === 'ka'
              ? 'შეიყვანეთ პროექტის სახელი'
              : 'Enter project name'
          }
          required
          error={
            projectName.length > 0 && projectName.trim().length < 2
              ? currentLanguage === 'ka'
                ? 'მინიმუმ 2 სიმბოლო'
                : 'Minimum 2 characters'
              : undefined
          }
          success={
            projectName.trim().length >= 2
              ? currentLanguage === 'ka'
                ? 'კარგი სახელია'
                : 'Good name'
              : undefined
          }
        />

        <div
          style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
        >
          <UnifiedButton
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth={false}
          >
            {currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
          </UnifiedButton>

          <UnifiedButton
            type="submit"
            variant="primary"
            disabled={!projectName.trim() || projectName.trim().length < 2}
            fullWidth={false}
          >
            {submitText}
          </UnifiedButton>
        </div>
      </UnifiedForm>
    </div>
  );
}
