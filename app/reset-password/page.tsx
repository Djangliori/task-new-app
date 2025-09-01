'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';
import {
  UnifiedForm,
  UnifiedInput,
  UnifiedButton,
} from '../components/ui/UnifiedForm';
import { getSupabaseClient } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useTranslation } from '../components/hooks/useTranslation';

function ResetPasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation(currentLanguage);

  // Load language on component mount
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);

    // Check if we have the necessary query parameters from email link
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setMessage(t('invalidResetLink'));
      setIsSuccess(false);
    }
  }, [searchParams, t]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ka' ? 'en' : 'ka';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Basic validation
    if (!oldPassword.trim()) {
      setMessage(
        currentLanguage === 'ka'
          ? 'ძველი პაროლის შეყვანა აუცილებელია'
          : 'Old password is required'
      );
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t('errorPasswordsDontMatch'));
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage(t('errorPasswordTooShort'));
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();

      // Get the access token from URL parameters
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setMessage(t('invalidResetLink'));
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // Set the session using the tokens from the email link
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        logger.error('Session error:', sessionError);
        setMessage(t('invalidResetLink'));
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // First, verify the old password by attempting to sign in
      const { data: user } = await supabase.auth.getUser();

      if (!user.user?.email) {
        setMessage(t('invalidResetLink'));
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // Create a new Supabase client to test the old password
      const testSupabase = getSupabaseClient();
      const { error: verifyError } = await testSupabase.auth.signInWithPassword(
        {
          email: user.user.email,
          password: oldPassword,
        }
      );

      if (verifyError) {
        logger.error('Old password verification failed:', verifyError);
        setMessage(t('invalidOldPassword'));
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // If old password is verified, proceed with updating to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        logger.error('Password update error:', error);
        setMessage(t('passwordUpdateError'));
        setIsSuccess(false);
      } else {
        logger.log('Password updated successfully');
        setMessage(t('passwordUpdated'));
        setIsSuccess(true);

        // Clear form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      logger.error('Password reset catch error:', error);
      setMessage(t('passwordUpdateError'));
      setIsSuccess(false);
    }

    setIsLoading(false);
  };

  return (
    <CenterWrapper>
      <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
          }}
        >
          <button
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: '2px solid #4da8da',
              color: '#4da8da',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            {currentLanguage === 'ka' ? 'ENG' : 'ქარ'}
          </button>
        </div>

        <UnifiedForm title={t('resetPasswordTitle')} onSubmit={handleSubmit}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              color: '#7f8c8d',
              fontSize: '16px',
            }}
          >
            {currentLanguage === 'ka'
              ? 'ჯერ შეიყვანეთ ძველი პაროლი, შემდეგ ახალი'
              : 'First enter your old password, then new password'}
          </div>

          <div>
            <UnifiedInput
              label={t('oldPassword')}
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t('oldPasswordPlaceholder')}
              required
              error={
                oldPassword.length > 0 && oldPassword.length < 4
                  ? currentLanguage === 'ka'
                    ? 'მინიმუმ 4 სიმბოლო'
                    : 'Minimum 4 characters'
                  : undefined
              }
              success={
                oldPassword.length >= 4
                  ? currentLanguage === 'ka'
                    ? 'ძველი პაროლი შეყვანილია'
                    : 'Old password entered'
                  : undefined
              }
            />
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#7f8c8d',
              }}
            >
              <label
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showOldPassword}
                  onChange={(e) => setShowOldPassword(e.target.checked)}
                  style={{
                    cursor: 'pointer',
                    transform: 'scale(0.9)',
                  }}
                />
                {t('showPassword')}
              </label>
            </div>
          </div>

          <div>
            <UnifiedInput
              label={t('newPassword')}
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('newPasswordPlaceholder')}
              required
              error={
                newPassword.length > 0 && newPassword.length < 6
                  ? t('errorPasswordTooShort')
                  : undefined
              }
              success={
                newPassword.length >= 6
                  ? currentLanguage === 'ka'
                    ? 'კარგი პაროლი'
                    : 'Good password'
                  : undefined
              }
            />
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#7f8c8d',
              }}
            >
              <label
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{
                    cursor: 'pointer',
                    transform: 'scale(0.9)',
                  }}
                />
                {t('showPassword')}
              </label>
            </div>
          </div>

          <div>
            <UnifiedInput
              label={t('confirmNewPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmNewPasswordPlaceholder')}
              required
              error={
                confirmPassword.length > 0 && confirmPassword !== newPassword
                  ? t('errorPasswordsDontMatch')
                  : undefined
              }
              success={
                confirmPassword.length >= 6 && confirmPassword === newPassword
                  ? currentLanguage === 'ka'
                    ? 'პაროლები ემთხვევა'
                    : 'Passwords match'
                  : undefined
              }
            />
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#7f8c8d',
              }}
            >
              <label
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={(e) => setShowConfirmPassword(e.target.checked)}
                  style={{
                    cursor: 'pointer',
                    transform: 'scale(0.9)',
                  }}
                />
                {t('showPassword')}
              </label>
            </div>
          </div>

          {message && (
            <div
              style={{
                background: isSuccess ? '#d4edda' : '#fee',
                color: isSuccess ? '#27ae60' : '#e74c3c',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                border: `1px solid ${isSuccess ? '#27ae60' : '#e74c3c'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSuccess ? '✅' : '⚠'} {message}
            </div>
          )}

          {isSuccess && (
            <div
              style={{
                background: '#e8f4fd',
                color: '#2c3e50',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #4da8da',
                textAlign: 'center',
              }}
            >
              {currentLanguage === 'ka'
                ? '3 წამში გადამისამართება შესვლის გვერდზე...'
                : 'Redirecting to login page in 3 seconds...'}
            </div>
          )}

          <UnifiedButton
            type="submit"
            variant="primary"
            disabled={
              isLoading ||
              !oldPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim() ||
              newPassword !== confirmPassword ||
              newPassword.length < 6 ||
              isSuccess
            }
            isLoading={isLoading}
          >
            {isLoading ? t('updatingPassword') : t('updatePassword')}
          </UnifiedButton>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <a
              href="/login"
              style={{
                color: '#4da8da',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'color 0.2s ease',
              }}
            >
              ←{' '}
              {currentLanguage === 'ka'
                ? 'შესვლის გვერდზე დაბრუნება'
                : 'Back to Login'}
            </a>
          </div>
        </UnifiedForm>
      </div>
    </CenterWrapper>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <CenterWrapper>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading...</div>
          </div>
        </CenterWrapper>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
