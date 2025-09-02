import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'signup' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Get current URL for proper redirect
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let result: any;
    let testType: string = 'Unknown test type';

    if (type === 'signup') {
      // Test signup email
      testType = 'Registration confirmation email';
      const redirectTo = `${baseUrl}/auth/confirm`;

      result = await supabase.auth.signUp({
        email: email,
        password: 'temp-test-password-123456', // Temporary password for test
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: 'Test',
            last_name: 'User',
          },
        },
      });

      console.log('📧 Test signup result:', {
        email,
        redirectTo,
        baseUrl,
        success: !result.error,
        error: result.error?.message,
        userCreated: !!result.data?.user,
        sessionCreated: !!result.data?.session,
      });
    } else if (type === 'reset') {
      // Test password reset email
      testType = 'Password reset email';
      const redirectTo = `${baseUrl}/reset-password`;

      result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      console.log('📧 Test reset result:', {
        email,
        redirectTo,
        baseUrl,
        success: !result.error,
        error: result.error?.message,
      });
    }

    if (result?.error) {
      console.error(`❌ ${testType} error:`, result.error);
      return NextResponse.json(
        {
          success: false,
          testType,
          error: result.error.message,
          details: {
            code: result.error.status,
            message: result.error.message,
            email,
            baseUrl,
            redirectUrl:
              type === 'signup'
                ? `${baseUrl}/auth/confirm`
                : `${baseUrl}/reset-password`,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      testType,
      message: `✅ ${testType} sent! Check your inbox and spam folder.`,
      details: {
        email,
        baseUrl,
        redirectUrl:
          type === 'signup'
            ? `${baseUrl}/auth/confirm`
            : `${baseUrl}/reset-password`,
        environment: process.env.NODE_ENV,
        userCreated: type === 'signup' ? !!result?.data?.user : undefined,
        sessionCreated: type === 'signup' ? !!result?.data?.session : undefined,
      },
    });
  } catch (error) {
    console.error('❌ Test email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
        details: error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email Test API',
    usage: 'POST with { "email": "test@example.com", "type": "signup|reset" }',
    available_types: ['signup', 'reset'],
  });
}
