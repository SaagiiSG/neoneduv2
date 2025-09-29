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

export async function GET(request) {
  // Authenticate the request
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching team members', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
      .insert([body])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Team member with this information already exists' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error creating team member', error: error.message },
      { status: 500 }
    );
  }
}


