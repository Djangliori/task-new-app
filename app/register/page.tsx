'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CenterWrapper } from '../components/ui/CenterWrapper';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const router = useRouter();

  // Translation function
  const translations = {
    ka: {
      register: 'რეგისტრაცია',
      createNewAccount: 'ახალი ანგარიშის შექმნა',
      firstName: 'სახელი:',
      firstNamePlaceholder: 'სახელი',
      lastName: 'გვარი:',
      lastNamePlaceholder: 'გვარი',
      email: 'ელ-ფოსტა:',
      emailPlaceholder: 'შეიყვანეთ ელ-ფოსტა',
      password: 'პაროლი:',
      passwordPlaceholder: 'შეიყვანეთ პაროლი (მინ. 6 სიმბოლო)',
      confirmPassword: 'პაროლის გამეორება:',
      confirmPasswordPlaceholder: 'გაიმეორეთ პაროლი',
      createButton: 'ანგარიშის შექმნა',
      registering: 'რეგისტრაცია...',
      alreadyHaveAccount: 'უკვე გაქვს ანგარიში?',
      signIn: 'შესვლა',
      errorAllFieldsRequired: 'ყველა ველის შევსება სავალდებულოა',
      errorPasswordsDontMatch: 'პაროლები არ ემთხვევა',
      errorPasswordTooShort: 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო',
      errorEmailExists: 'ეს ელ-ფოსტა უკვე რეგისტრირებულია',
    },
    en: {
      register: 'Register',
      createNewAccount: 'Create New Account',
      firstName: 'First Name:',
      firstNamePlaceholder: 'First Name',
      lastName: 'Last Name:',
      lastNamePlaceholder: 'Last Name',
      email: 'Email:',
      emailPlaceholder: 'Enter your email',
      password: 'Password:',
      passwordPlaceholder: 'Enter password (min. 6 characters)',
      confirmPassword: 'Confirm Password:',
      confirmPasswordPlaceholder: 'Confirm your password',
      createButton: 'Create Account',
      registering: 'Creating...',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign In',
      errorAllFieldsRequired: 'All fields are required',
      errorPasswordsDontMatch: 'Passwords do not match',
      errorPasswordTooShort: 'Password must be at least 6 characters',
      errorEmailExists: 'This email is already registered',
    },
  };

  const t = (key: keyof typeof translations.ka) =>
    translations[currentLanguage][key];

  // Load language on mount
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

    // Validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError(t('errorAllFieldsRequired'));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('errorPasswordsDontMatch'));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('errorPasswordTooShort'));
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((user: { email: string }) => user.email === email)) {
      setError(t('errorEmailExists'));
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      createdAt: new Date().toISOString(),
    };

    // Add to users array
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Redirect to login page
    router.push('/login');

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
          width: '450px',
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
            {t('register')}
          </h1>
          <p
            style={{
              color: '#7f8c8d',
              margin: 0,
              fontSize: '16px',
            }}
          >
            {t('createNewAccount')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
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
                {t('firstName')}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('firstNamePlaceholder')}
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

            <div style={{ flex: 1 }}>
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
                {t('lastName')}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('lastNamePlaceholder')}
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
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
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
            disabled={
              isLoading ||
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !password.trim() ||
              !confirmPassword.trim()
            }
            style={{
              width: '100%',
              padding: '14px',
              background:
                isLoading ||
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
                  ? '#bdc3c7'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor:
                isLoading ||
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? t('registering') : t('createButton')}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
          }}
        >
          <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
            {t('alreadyHaveAccount')}
          </span>{' '}
          <a
            href="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {t('signIn')}
          </a>
        </div>
      </div>
    </CenterWrapper>
  );
}
