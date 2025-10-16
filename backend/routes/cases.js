const express = require('express');
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a new case
// @route   POST /api/cases
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, case_type, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const { data: newCase, error } = await supabase
      .from('cases')
      .insert([{
        user_id: req.user.id,
        title,
        description: description || '',
        case_type: case_type || 'general',
        status: status || 'open',
        priority: priority || 'medium',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Server error creating case' });
    }

    res.status(201).json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating case' });
  }
});

// @desc    Get user cases
// @route   GET /api/cases
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { data: cases, error } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Server error fetching cases' });
    }

    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching cases' });
  }
});

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: caseItem, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(caseItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching case' });
  }
});

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, case_type, status, priority, progress } = req.body;

    // Check if case belongs to user
    const { data: existingCase, error: fetchError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (case_type) updateData.case_type = case_type;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (progress !== undefined) updateData.progress = progress;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedCase, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Server error updating case' });
    }

    res.json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating case' });
  }
});

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ message: 'Server error deleting case' });
    }

    res.json({ message: 'Case deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting case' });
  }
});

module.exports = router;