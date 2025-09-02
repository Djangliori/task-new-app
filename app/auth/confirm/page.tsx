'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '../../lib/supabase';
import { logger } from '../../lib/logger';
import { useTranslation } from '../../components/hooks/useTranslation';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const { t } = useTranslation(currentLanguage);
  const [message, setMessage] = useState('მიმდინარეობს დადასტურება...');
  const [isSuccess, setIsSuccess] = useState(false);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check for hash fragment tokens first (like in reset-password)
        let access_token, refresh_token;

        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          access_token = params.get('access_token');
          refresh_token = params.get('refresh_token');

          logger.log('🔍 Hash fragment debug:', {
            fullHash: window.location.hash,
            cleanedHash: hash,
            accessToken: access_token ? 'FOUND' : 'MISSING',
            refreshToken: refresh_token ? 'FOUND' : 'MISSING',
            allParams: Object.fromEntries(params.entries())
          });
        }

        // Fallback to query params
        if (!access_token) {
          access_token = searchParams.get('access_token');
          refresh_token = searchParams.get('refresh_token');
        }

        if (access_token && refresh_token) {
          // Create supabase client only on client-side
          const supabase = getSupabaseClient();

          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            logger.error('❌ Confirmation error:', error);
            setMessage(
              currentLanguage === 'ka'
                ? '❌ დადასტურების შეცდომა. გთხოვთ ისევ სცადოთ.'
                : '❌ Confirmation error. Please try again.'
            );
            setIsSuccess(false);
          } else {
            logger.log('✅ Email confirmed successfully');
            setMessage(
              currentLanguage === 'ka'
                ? '✅ ელ-ფოსტა წარმატებით დადასტურდა! ახლა შეგიძლიათ შემოხვიდეთ.'
                : '✅ Email confirmed successfully! You can now sign in.'
            );
            setIsSuccess(true);

            // Redirect to main page after 3 seconds
            setTimeout(() => {
              router.push('/');
            }, 3000);
          }
        } else {
          logger.log('❌ No tokens found:', {
            windowExists: typeof window !== 'undefined',
            hasHash: typeof window !== 'undefined' && !!window.location.hash,
            hashContent: typeof window !== 'undefined' ? window.location.hash : 'NO_WINDOW',
            searchParamsToken: searchParams.get('access_token')
          });
          
          setMessage(
            currentLanguage === 'ka'
              ? '❌ არასწორი დადასტურების ბმული.'
              : '❌ Invalid confirmation link.'
          );
          setIsSuccess(false);
        }
      } catch (error) {
        logger.error('❌ Confirmation catch error:', error);
        setMessage(
          currentLanguage === 'ka'
            ? '❌ დადასტურების შეცდომა მოხდა.'
            : '❌ Confirmation error occurred.'
        );
        setIsSuccess(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router, currentLanguage]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '48px 40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '24px',
          }}
        >
          {isSuccess ? '✅' : '⏳'}
        </div>

        <h2
          style={{
            color: '#2c3e50',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '16px',
          }}
        >
          {currentLanguage === 'ka'
            ? 'ელ-ფოსტის დადასტურება'
            : 'Email Confirmation'}
        </h2>

        <p
          style={{
            color: '#7f8c8d',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '32px',
          }}
        >
          {message}
        </p>

        {isSuccess && (
          <>
            <p
              style={{
                color: '#27ae60',
                fontSize: '14px',
                fontStyle: 'italic',
                marginBottom: '20px',
              }}
            >
              {currentLanguage === 'ka'
                ? '🙏 მადლობა რომ სარგებლობთ ჩვენი სერვისით!'
                : '🙏 Thank you for using our service!'}
            </p>
            <p
              style={{
                color: '#7f8c8d',
                fontSize: '12px',
                marginBottom: '20px',
              }}
            >
              {currentLanguage === 'ka'
                ? 'ავტომატურად გადამისამართება 3 წამში...'
                : 'Automatically redirecting in 3 seconds...'}
            </p>
          </>
        )}

        <button
          onClick={() => (isSuccess ? router.push('/') : router.push('/login'))}
          style={{
            background: isSuccess ? '#27ae60' : '#4da8da',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '16px',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {isSuccess
            ? currentLanguage === 'ka'
              ? '🏠 მთავარ გვერდზე გადასვლა'
              : '🏠 Go to Main Page'
            : currentLanguage === 'ka'
              ? '🔐 ლოგინზე გადასვლა'
              : '🔐 Go to Login'}
        </button>

        {/* Language Toggle */}
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => {
              const newLang = currentLanguage === 'ka' ? 'en' : 'ka';
              setCurrentLanguage(newLang);
              localStorage.setItem('language', newLang);
            }}
            style={{
              background: 'none',
              border: '1px solid #bdc3c7',
              color: '#7f8c8d',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {currentLanguage === 'ka' ? 'ENG' : 'ქართ'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#7f8c8d' }}>იტვირთება...</p>
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
