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

export async function GET(request, { params }) {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Study abroad program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: program
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching study abroad program', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    
    const { data: program, error } = await supabase
      .from('study_abroad')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Study abroad program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Study abroad program updated successfully',
      data: program
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating study abroad program', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Study abroad program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Study abroad program deleted successfully',
      data: program
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error deleting study abroad program', error: error.message },
      { status: 500 }
    );
  }
}


