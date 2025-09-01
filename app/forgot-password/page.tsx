'use client';

import React, { useState, useEffect } from 'react';
import { CenterWrapper } from '../components/ui/CenterWrapper';
import {
  UnifiedForm,
  UnifiedInput,
  UnifiedButton,
} from '../components/ui/UnifiedForm';
import { getSupabaseClient } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useTranslation } from '../components/hooks/useTranslation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [isSuccess, setIsSuccess] = useState(false);

  // Translation hook
  const { t } = useTranslation(currentLanguage);

  // Load language on component mount
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ka' ? 'en' : 'ka';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      logger.log('🔐 Attempting password reset for:', {
        email: email.trim().toLowerCase(),
        timestamp: new Date().toISOString(),
      });

      // Create supabase client only when needed
      const supabase = getSupabaseClient();

      // Get current domain for redirect URL
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (error) {
        logger.error('❌ Password reset error:', {
          message: error.message,
          status: error.status,
          details: error,
        });
        setError(t('passwordUpdateError'));
      } else {
        logger.log('✅ Password reset email sent to:', email);
        setIsSuccess(true);
        setEmail(''); // Clear the email field
      }
    } catch (error) {
      logger.error('❌ Password reset catch error:', error);
      setError(t('passwordUpdateError'));
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
            {t('enterEmailForReset')}
          </div>

          <UnifiedInput
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            required
            error={
              email.length > 0 && !email.includes('@')
                ? currentLanguage === 'ka'
                  ? 'სწორი ემაილის ფორმატი'
                  : 'Valid email format required'
                : undefined
            }
            success={
              email.includes('@') && email.includes('.')
                ? currentLanguage === 'ka'
                  ? 'სწორი ემაილი'
                  : 'Valid email'
                : undefined
            }
          />

          {error && (
            <div
              style={{
                background: '#fee',
                color: '#e74c3c',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #e74c3c',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚠ {error}
            </div>
          )}

          {isSuccess && (
            <div
              style={{
                background: '#d4edda',
                color: '#27ae60',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #27ae60',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ✅ {t('resetEmailSent')}
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
              }}
            >
              {t('checkYourEmail')}
            </div>
          )}

          <UnifiedButton
            type="submit"
            variant="primary"
            disabled={isLoading || !email.trim()}
            isLoading={isLoading}
          >
            {isLoading ? t('sendingEmail') : t('sendResetEmail')}
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
