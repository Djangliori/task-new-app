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
import { createClient } from '@supabase/supabase-js';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      showPassword: 'პაროლის ჩვენება',
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
      showPassword: 'Show Password',
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

    try {
      // Sign up with Supabase Auth (disable email confirmation for development)
      console.log('🔄 Starting registration for:', email.trim().toLowerCase());
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }
        },
      });
      
      console.log('📊 Registration result:', {
        user: data.user?.id,
        session: data.session?.access_token ? 'YES' : 'NO',
        error: error?.message,
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError(t('errorEmailExists'));
        } else {
          setError(error.message);
        }
      } else if (data.user) {
        // Wait for the user to be properly authenticated first
        const { data: session } = await supabase.auth.getSession();
        
        // Create profile using service role to bypass RLS during registration
        try {
          const response = await fetch('/api/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: email.trim().toLowerCase(),
              firstName: firstName.trim(),
              lastName: lastName.trim(),
            }),
          });
          
          if (response.ok) {
            console.log('✅ Profile created successfully via API for:', email);
          } else {
            const error = await response.text();
            console.error('❌ Profile API creation failed:', error);
          }
        } catch (apiError) {
          console.error('❌ Profile API error:', apiError);
          
          // Fallback to direct insertion
          const { error: profileError } = await supabase.from('users').insert([
            {
              id: data.user.id,
              email: email.trim().toLowerCase(),
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          ]);
          
          if (profileError) {
            console.error('❌ Direct profile creation FAILED:', profileError);
          } else {
            console.log('✅ Direct profile created successfully for:', email);
          }
        }

        // Show success message instead of immediate redirect
        alert(currentLanguage === 'ka' 
          ? '✅ რეგისტრაცია წარმატებით დასრულდა! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა დასადასტურებლად.'
          : '✅ Registration successful! Please check your email for confirmation.'
        );
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
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

        <UnifiedForm title={t('register')} onSubmit={handleSubmit}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              color: '#7f8c8d',
              fontSize: '16px',
            }}
          >
            {t('createNewAccount')}
          </div>

          <UnifiedInput
            label={t('firstName')}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('firstNamePlaceholder')}
            required
            error={
              firstName.length > 0 && firstName.trim().length < 2
                ? currentLanguage === 'ka'
                  ? 'მინიმუმ 2 სიმბოლო'
                  : 'Minimum 2 characters'
                : undefined
            }
            success={
              firstName.trim().length >= 2
                ? currentLanguage === 'ka'
                  ? 'კარგი სახელი'
                  : 'Good name'
                : undefined
            }
          />

          <UnifiedInput
            label={t('lastName')}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('lastNamePlaceholder')}
            required
            error={
              lastName.length > 0 && lastName.trim().length < 2
                ? currentLanguage === 'ka'
                  ? 'მინიმუმ 2 სიმბოლო'
                  : 'Minimum 2 characters'
                : undefined
            }
            success={
              lastName.trim().length >= 2
                ? currentLanguage === 'ka'
                  ? 'კარგი გვარი'
                  : 'Good surname'
                : undefined
            }
          />

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

          <div>
            <UnifiedInput
              label={t('password')}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              required
              error={
                password.length > 0 && password.length < 6
                  ? currentLanguage === 'ka'
                    ? 'მინიმუმ 6 სიმბოლო'
                    : 'Minimum 6 characters'
                  : undefined
              }
              success={
                password.length >= 6
                  ? currentLanguage === 'ka'
                    ? 'კარგი პაროლი'
                    : 'Strong password'
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
              label={t('confirmPassword')}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
              required
              error={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? currentLanguage === 'ka'
                    ? 'პაროლები არ ემთხვევა'
                    : 'Passwords do not match'
                  : undefined
              }
              success={
                confirmPassword.length > 0 &&
                password === confirmPassword &&
                password.length >= 6
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
            disabled={
              isLoading ||
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !password.trim() ||
              !confirmPassword.trim() ||
              password !== confirmPassword ||
              password.length < 6
            }
            isLoading={isLoading}
          >
            {isLoading ? t('registering') : t('createButton')}
          </UnifiedButton>

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
                color: '#4da8da',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s ease',
              }}
            >
              {t('signIn')}
            </a>
          </div>
        </UnifiedForm>
      </div>
    </CenterWrapper>
  );
}
