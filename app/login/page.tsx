'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';
import {
  UnifiedForm,
  UnifiedInput,
  UnifiedButton,
} from '../components/ui/UnifiedForm';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
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
    },
  };

  const t = (key: keyof typeof translations.ka) =>
    translations[currentLanguage][key];

  // Load language and check auto-login on mount
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);

    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/');
      return;
    }

    // Auto-fill with saved credentials if available
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      try {
        const { email, password } = JSON.parse(savedCredentials);
        setUsername(email);
        setPassword(password);
        // Auto-login
        handleAutoLogin(email, password);
      } catch {
        // If parsing fails, clear saved credentials
        localStorage.removeItem('savedCredentials');
      }
    }

    // Add default user to localStorage if not exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const defaultUserExists = existingUsers.find(
      (u: { email: string }) => u.email === 'mangalashvili@gmail.com'
    );

    if (!defaultUserExists) {
      const updatedUsers = [
        ...existingUsers,
        {
          email: 'mangalashvili@gmail.com',
          password: 'Erekle2003',
          firstName: 'Erekle',
          lastName: 'Mangalashvili',
        },
      ];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ka' ? 'en' : 'ka';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleAutoLogin = async (email: string, password: string) => {
    // Check existing users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (user) {
      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to main page
      router.push('/');
    } else if (email === 'admin@test.com' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'User',
        })
      );
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check existing users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(
      (u: { email: string; password: string }) =>
        u.email === username && u.password === password
    );

    if (user) {
      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Save credentials for next time
      localStorage.setItem(
        'savedCredentials',
        JSON.stringify({ email: username, password })
      );
      // Redirect to main page
      router.push('/');
    } else {
      // Test account ჯერ კიდევ მუშაობს
      if (username === 'admin@test.com' && password === 'password') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            email: 'admin@test.com',
            firstName: 'Admin',
            lastName: 'User',
          })
        );
        localStorage.setItem(
          'savedCredentials',
          JSON.stringify({ email: username, password })
        );
        router.push('/');
      } else {
        setError(t('errorWrongCredentials'));
      }
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

          <UnifiedInput
            label={t('password')}
            type="password"
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
