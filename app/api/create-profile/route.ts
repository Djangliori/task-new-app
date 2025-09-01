import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing required Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName } = await request.json();

    if (!userId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user profile using service role (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();
    const { error: profileError } = await supabaseAdmin.from('users').insert([
      {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
    ]);

    if (profileError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Service role profile creation error:', profileError);
      }
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Profile created successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
