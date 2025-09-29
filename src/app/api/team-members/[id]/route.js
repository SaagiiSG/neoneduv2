import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticateRequest } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request, { params }) {
  // Authenticate the request
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const { data: teamMember, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Team member not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching team member', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  // Authenticate the request
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    
    const { data: teamMember, error } = await supabase
      .from('team_members')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Team member not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating team member', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // Authenticate the request
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { data: teamMember, error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Team member not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
      data: teamMember
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error deleting team member', error: error.message },
      { status: 500 }
    );
  }
}


