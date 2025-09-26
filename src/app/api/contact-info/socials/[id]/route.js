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

export async function DELETE(request, { params }) {
  try {
    const { data: socialLink, error } = await supabase
      .from('contact_info_socials')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, message: 'Social media link not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Social media link removed successfully',
      data: socialLink
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error removing social media link', error: error.message },
      { status: 500 }
    );
  }
}


