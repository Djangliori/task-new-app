'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';
import {
  UnifiedForm,
  UnifiedInput,
  UnifiedButton,
} from '../components/ui/UnifiedForm';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Translation function
  const translations = {
    ka: {
      login: 'შესვლა',
      taskManagerLogin: 'Task Manager-ში შესასვლელად',
      email: 'ელ-ფოსტა:',
      emailPlaceholder: 'შეიყვანეთ ელ-ფოსტა',
      password: 'პაროლი:',
      passwordPlaceholder: 'შეიყვანეთ პაროლი',
      loginButton: 'შესვლა',
      checking: 'შემოწმება...',
      createAccount: 'Create New Account',
      errorWrongCredentials: 'შეცდომა: არასწორი ელ-ფოსტა ან პაროლი',
      showPassword: 'პაროლის ჩვენება',
    },
    en: {
      login: 'Login',
      taskManagerLogin: 'Sign in to Task Manager',
      email: 'Email:',
      emailPlaceholder: 'Enter your email',
      password: 'Password:',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Sign In',
      checking: 'Checking...',
      createAccount: 'Create New Account',
      errorWrongCredentials: 'Error: Invalid email or password',
      showPassword: 'Show Password',
    },
  };

  const t = (key: keyof typeof translations.ka) =>
    translations[currentLanguage][key];

  // Load language and check if user is already logged in
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);

    // Check if user is already logged in with Supabase
    const checkAuth = async () => {
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
      console.log('🔐 Attempting login with:', {
        email: loginEmail,
        passwordLength: password.length,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('❌ Supabase Auth Error:', {
          message: error.message,
          status: error.status,
          details: error
        });
        
        if (error.message.includes('Email not confirmed')) {
          setError(currentLanguage === 'ka' 
            ? 'ელ-ფოსტა არ არის დადასტურებული' 
            : 'Email not confirmed'
          );
        } else if (error.message.includes('Invalid login credentials')) {
          setError(currentLanguage === 'ka' 
            ? 'არასწორი ელ-ფოსტა ან პაროლი' 
            : 'Invalid email or password'
          );
        } else {
          setError(t('errorWrongCredentials'));
        }
      } else if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        router.push('/');
      }
    } catch (error) {
      console.error('❌ Login catch error:', error);
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
              type={showPassword ? "text" : "password"}
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
            }}
          >
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
