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
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Translation hook
  const { t } = useTranslation(currentLanguage);

  // Load language and check if user is already logged in
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);

    // Load remember me preference
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);

    // Check if user is already logged in with Supabase
    const checkAuth = async () => {
      try {
        // Check if we're forcing manual login (from confirmation page)
        const forceManualLogin = sessionStorage.getItem('forceManualLogin');
        if (forceManualLogin) {
          sessionStorage.removeItem('forceManualLogin');
          logger.log('🔄 Force manual login requested, staying on login page');
          return; // Don't check session, stay on login page
        }

        const supabase = getSupabaseClient();

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Only redirect if we have a valid session and no errors
        if (session && !error) {
          logger.log('✅ User already logged in, redirecting to main page');
          router.replace('/');
        }
      } catch (error) {
        logger.error('❌ Auth check error in login page:', error);
        // Stay on login page if auth check fails
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

    // Prevent double submissions
    if (isLoading) {
      logger.log('⚠️ Login already in progress, ignoring duplicate submission');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loginEmail = username.trim().toLowerCase();

      console.log('🔄 DETAILED LOGIN START:', {
        email: loginEmail,
        timestamp: new Date().toISOString(),
        rememberMe: rememberMe,
      });

      // Create supabase client
      const supabase = getSupabaseClient();
      console.log('📡 Supabase client created');

      console.log('🔑 Attempting signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      console.log('📊 LOGIN RESULT:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userId: data?.user?.id || 'none',
        userEmail: data?.user?.email || 'none',
        hasError: !!error,
        errorMessage: error?.message || 'none',
        errorName: error?.name || 'none',
      });

      // Log the full objects for debugging
      if (data) {
        console.log('📦 FULL LOGIN DATA:', data);
      }
      if (error) {
        console.log('❌ FULL LOGIN ERROR:', error);
      }

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
        setIsLoading(false);
      } else if (data.user) {
        // Save remember me preference for next time
        localStorage.setItem('rememberMe', rememberMe.toString());

        // If remember me is unchecked, session should expire when browser closes
        // But NOT immediately! Only on browser restart, not same-session navigation
        if (!rememberMe) {
          // Mark that this session should not persist across browser restarts
          localStorage.setItem('tempSessionOnly', 'true');
          // Remove any previous clearSessionOnClose flag for this session
          sessionStorage.removeItem('clearSessionOnClose');
        } else {
          // Remember me is checked - session persists across browser restarts
          localStorage.removeItem('tempSessionOnly');
          sessionStorage.removeItem('clearSessionOnClose');
        }

        logger.log('✅ Login successful:', {
          email: data.user.email,
          rememberMe: rememberMe,
          sessionPersisted: rememberMe,
          clearSessionFlag: sessionStorage.getItem('clearSessionOnClose'),
        });

        // Wait a bit to ensure session is fully established
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log('🔄 SUCCESS! Redirecting to main page...', {
          clearSessionFlag: sessionStorage.getItem('clearSessionOnClose'),
          rememberMeSet: localStorage.getItem('rememberMe'),
        });

        // Use replace instead of push to prevent back navigation issues
        router.replace('/');
      }
    } catch (error) {
      console.error('🚨 LOGIN CATCH ERROR - DETAILED:', {
        error: error,
        errorType: typeof error,
        errorName: error instanceof Error ? error.name : 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : 'no stack',
        timestamp: new Date().toISOString(),
      });

      setError(
        currentLanguage === 'ka'
          ? 'შესვლისას შეცდომა მოხდა. გთხოვთ ისევ სცადოთ.'
          : 'An error occurred during login. Please try again.'
      );
      setIsLoading(false);
    } finally {
      // Ensure loading state is always cleared
      console.log('🧹 LOGIN CLEANUP:', { wasLoading: isLoading });
      if (isLoading) {
        setIsLoading(false);
      }
    }
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

          {/* Remember Me Checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#7f8c8d',
              marginTop: '12px',
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
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                tabIndex={-1}
                style={{
                  cursor: 'pointer',
                  transform: 'scale(0.9)',
                }}
              />
              {currentLanguage === 'ka' ? 'დამიმახსოვრე' : 'Remember me'}
            </label>
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
