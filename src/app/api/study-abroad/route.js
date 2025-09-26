import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  try {
    const { data: programs, error } = await supabase
      .from('study_abroad')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching study abroad programs', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data: program, error } = await supabase
      .from('study_abroad')
      .insert([body])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Study abroad program with this information already exists' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Study abroad program created successfully',
      data: program
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error creating study abroad program', error: error.message },
      { status: 500 }
    );
  }
}


