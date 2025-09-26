const supabase = require('../lib/supabase');

// Get all study abroad programs
const getAllStudyAbroadPrograms = async (req, res) => {
  try {
    const { data: programs, error } = await supabase
      .from('study_abroad')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study abroad programs',
      error: error.message
    });
  }
};

// Get single study abroad program
const getStudyAbroadProgram = async (req, res) => {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Study abroad program not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study abroad program',
      error: error.message
    });
  }
};

// Create new study abroad program
const createStudyAbroadProgram = async (req, res) => {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .insert([req.body])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Study abroad program created successfully',
      data: program
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Study abroad program with this information already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating study abroad program',
      error: error.message
    });
  }
};

// Update study abroad program
const updateStudyAbroadProgram = async (req, res) => {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Study abroad program not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Study abroad program updated successfully',
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating study abroad program',
      error: error.message
    });
  }
};

// Delete study abroad program
const deleteStudyAbroadProgram = async (req, res) => {
  try {
    const { data: program, error } = await supabase
      .from('study_abroad')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Study abroad program not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Study abroad program deleted successfully',
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting study abroad program',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudyAbroadPrograms,
  getStudyAbroadProgram,
  createStudyAbroadProgram,
  updateStudyAbroadProgram,
  deleteStudyAbroadProgram
};