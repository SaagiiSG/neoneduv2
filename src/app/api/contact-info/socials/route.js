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

export async function POST(request) {
  try {
    const { platform, url } = await request.json();

    // Get contact info ID
    const { data: contactInfo } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    if (!contactInfo) {
      return NextResponse.json(
        { success: false, message: 'Contact info not found. Please create contact info first.' },
        { status: 404 }
      );
    }

    const { data: socialLink, error } = await supabase
      .from('contact_info_socials')
      .insert([{
        contact_info_id: contactInfo.id,
        platform,
        url
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Social media platform already exists' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Social media link added successfully',
      data: socialLink
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error adding social media link', error: error.message },
      { status: 500 }
    );
  }
}


