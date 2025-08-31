'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';

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
          lastName: 'Mangalashvili'
        }
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
      localStorage.setItem('savedCredentials', JSON.stringify({ email: username, password }));
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
        localStorage.setItem('savedCredentials', JSON.stringify({ email: username, password }));
        router.push('/');
      } else {
        setError(t('errorWrongCredentials'));
      }
    }

    setIsLoading(false);
  };

  return (
    <CenterWrapper>
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          width: '400px',
          maxWidth: '90vw',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={toggleLanguage}
              style={{
                background: 'none',
                border: '2px solid #667eea',
                color: '#667eea',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {currentLanguage === 'ka' ? 'ENG' : 'ქარ'}
            </button>
          </div>

          <h1
            style={{
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            {t('login')}
          </h1>
          <p
            style={{
              color: '#7f8c8d',
              margin: 0,
              fontSize: '16px',
            }}
          >
            {t('taskManagerLogin')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {t('email')}
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2c3e50',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #fcc',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background:
                isLoading || !username.trim() || !password.trim()
                  ? '#bdc3c7'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor:
                isLoading || !username.trim() || !password.trim()
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? t('checking') : t('loginButton')}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
          }}
        >
          <a
            href="/register"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            {t('createAccount')}
          </a>
        </div>
      </div>
    </CenterWrapper>
  );
}
