const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename using crypto
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// @desc    Upload legal document
// @route   POST /api/documents/upload
// @access  Private
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save document record to database
    const { data: document, error } = await supabase
      .from('documents')
      .insert([{
        user_id: req.user.id,
        title: req.body.title || req.file.originalname,
        file_path: req.file.path,
        file_name: req.file.filename,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        document_type: req.body.document_type || 'general',
        description: req.body.description || '',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error saving document record' });
    }

    res.status(201).json({ document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error uploading document' });
  }
});

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Server error fetching documents' });
    }

    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
});

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching document' });
  }
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Get document to check ownership and file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete document record from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (deleteError) {
      return res.status(500).json({ message: 'Server error deleting document' });
    }

    // Note: In a production environment, you would also delete the actual file
    // For this demo, we're only removing the database record
    
    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting document' });
  }
});

module.exports = router;