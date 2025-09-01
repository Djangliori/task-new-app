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
    const savedLanguage = (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (token_hash && type) {
          // Create supabase client only on client-side
          const supabase = getSupabaseClient();

          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup',
          });

          if (error) {
            logger.error('❌ Confirmation error:', error);
            setMessage('დადასტურების შეცდომა. გთხოვთ ისევ სცადოთ.');
            setIsSuccess(false);
          } else {
            logger.log('✅ Email confirmed successfully');
            setMessage(
              '✅ ელ-ფოსტა წარმატებით დადასტურდა! ახლა შეგიძლიათ შემოხვიდეთ.'
            );
            setIsSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          }
        } else {
          setMessage('❌ არასწორი დადასტურების ბმული.');
          setIsSuccess(false);
        }
      } catch (error) {
        logger.error('❌ Confirmation catch error:', error);
        setMessage('❌ დადასტურების შეცდომა მოხდა.');
        setIsSuccess(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
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
          width: '90%',
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
          ელ-ფოსტის დადასტურება
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
          <p
            style={{
              color: '#27ae60',
              fontSize: '14px',
              fontStyle: 'italic',
            }}
          >
            {t('redirectingToLogin')}
          </p>
        )}

        <button
          onClick={() => router.push('/login')}
          style={{
            background: '#4da8da',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          {t('goToLogin')}
        </button>
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
