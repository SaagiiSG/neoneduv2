const supabase = require('../lib/supabase');

// Get contact info
const getContactInfo = async (req, res) => {
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
          address: 'Default Address',
          phone: '+976-12345678',
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

      return res.status(200).json({
        success: true,
        data: newContactInfo
      });
    }

    res.status(200).json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact info',
      error: error.message
    });
  }
};

// Update contact info
const updateContactInfo = async (req, res) => {
  try {
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
        .update(req.body)
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
        .insert([req.body])
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

    res.status(200).json({
      success: true,
      message: 'Contact info updated successfully',
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact info',
      error: error.message
    });
  }
};

// Add social media link
const addSocialLink = async (req, res) => {
  try {
    const { platform, url } = req.body;

    // Get contact info ID
    const { data: contactInfo } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: 'Contact info not found. Please create contact info first.'
      });
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
        return res.status(400).json({
          success: false,
          message: 'Social media platform already exists'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Social media link added successfully',
      data: socialLink
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding social media link',
      error: error.message
    });
  }
};

// Remove social media link
const removeSocialLink = async (req, res) => {
  try {
    const { socialId } = req.params;

    const { data: socialLink, error } = await supabase
      .from('contact_info_socials')
      .delete()
      .eq('id', socialId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Social media link not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Social media link removed successfully',
      data: socialLink
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing social media link',
      error: error.message
    });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
  addSocialLink,
  removeSocialLink
};