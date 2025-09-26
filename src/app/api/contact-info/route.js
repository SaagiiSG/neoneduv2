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
    const { data: contactInfo, error } = await supabase
      .from('contact_info')
      .select(`
        *,
        contact_info_socials (
          id,
          platform,
          url
        )
      `)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!contactInfo) {
      // Create default contact info if none exists
      const { data: newContactInfo, error: createError } = await supabase
        .from('contact_info')
        .insert([{
          address: 'Ulaanbaatar, Mongolia',
          phone: '+976-11-123456',
          email: 'info@neonedu.com'
        }])
        .select(`
          *,
          contact_info_socials (
            id,
            platform,
            url
          )
        `)
        .single();

      if (createError) {
        throw createError;
      }

      return NextResponse.json({
        success: true,
        data: newContactInfo
      });
    }

    return NextResponse.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching contact info', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    
    // First, try to get existing contact info
    const { data: existingContactInfo } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    let contactInfo;

    if (existingContactInfo) {
      // Update existing contact info
      const { data, error } = await supabase
        .from('contact_info')
        .update(body)
        .eq('id', existingContactInfo.id)
        .select(`
          *,
          contact_info_socials (
            id,
            platform,
            url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      contactInfo = data;
    } else {
      // Create new contact info
      const { data, error } = await supabase
        .from('contact_info')
        .insert([body])
        .select(`
          *,
          contact_info_socials (
            id,
            platform,
            url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      contactInfo = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Contact info updated successfully',
      data: contactInfo
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating contact info', error: error.message },
      { status: 500 }
    );
  }
}


