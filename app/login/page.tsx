'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';
import {
  UnifiedForm,
  UnifiedInput,
  UnifiedButton,
} from '../components/ui/UnifiedForm';
import { getSupabaseClient } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useTranslation } from '../components/hooks/useTranslation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Translation hook
  const { t } = useTranslation(currentLanguage);

  // Load language and check if user is already logged in
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);

    // Check if user is already logged in with Supabase
    const checkAuth = async () => {
      const supabase = getSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

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
      const loginEmail = username.trim().toLowerCase();

      // Create supabase client only when needed
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        logger.error('❌ Supabase Auth Error:', error.message);

        if (error.message.includes('Email not confirmed')) {
          setError(
            currentLanguage === 'ka'
              ? 'ელ-ფოსტა არ არის დადასტურებული'
              : 'Email not confirmed'
          );
        } else if (error.message.includes('Invalid login credentials')) {
          setError(
            currentLanguage === 'ka'
              ? 'არასწორი ელ-ფოსტა ან პაროლი'
              : 'Invalid email or password'
          );
        } else {
          setError(t('errorWrongCredentials'));
        }
      } else if (data.user) {
        router.push('/');
      }
    } catch (error) {
      logger.error('❌ Login catch error:', error);
      setError(t('errorWrongCredentials'));
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

        <UnifiedForm title={t('login')} onSubmit={handleSubmit}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              color: '#7f8c8d',
              fontSize: '16px',
            }}
          >
            {t('taskManagerLogin')}
          </div>

          <UnifiedInput
            label={t('email')}
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('emailPlaceholder')}
            required
            error={
              username.length > 0 && !username.includes('@')
                ? currentLanguage === 'ka'
                  ? 'სწორი ემაილის ფორმატი'
                  : 'Valid email format required'
                : undefined
            }
            success={
              username.includes('@') && username.includes('.')
                ? currentLanguage === 'ka'
                  ? 'სწორი ემაილი'
                  : 'Valid email'
                : undefined
            }
          />

          <div>
            <UnifiedInput
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              required
              error={
                password.length > 0 && password.length < 4
                  ? currentLanguage === 'ka'
                    ? 'მინიმუმ 4 სიმბოლო'
                    : 'Minimum 4 characters'
                  : undefined
              }
              success={
                password.length >= 4
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
                  tabIndex={-1}
                  style={{
                    cursor: 'pointer',
                    transform: 'scale(0.9)',
                  }}
                />
                {t('showPassword')}
              </label>
            </div>
          </div>

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

          <UnifiedButton
            type="submit"
            variant="primary"
            disabled={isLoading || !username.trim() || !password.trim()}
            isLoading={isLoading}
          >
            {isLoading ? t('checking') : t('loginButton')}
          </UnifiedButton>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <a
              href="/forgot-password"
              style={{
                color: '#7f8c8d',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '400',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.color = '#4da8da')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.color = '#7f8c8d')
              }
            >
              {t('forgotPassword')}
            </a>
            <a
              href="/register"
              style={{
                color: '#4da8da',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'color 0.2s ease',
              }}
            >
              {t('createAccount')}
            </a>
          </div>
        </UnifiedForm>
      </div>
    </CenterWrapper>
  );
}
