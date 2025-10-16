const express = require('express');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI and Pinecone
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// @desc    Ask AI legal question
// @route   POST /api/ai/ask
// @access  Private
router.post('/ask', protect, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Query Pinecone for relevant legal documents
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    
    // Embed the question
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // Query Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });
    
    // Format context from Pinecone results
    let context = '';
    if (queryResponse.matches.length > 0) {
      context = queryResponse.matches
        .map(match => match.metadata.text)
        .join('\n\n');
    }
    
    // Create GPT-4 completion with context
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Using GPT-4 Turbo
      messages: [
        {
          role: "system",
          content: `You are an AI legal assistant specialized in Indonesian law. Provide accurate, helpful, and concise legal information. Always include relevant Indonesian legal references if known. Be careful not to provide legal advice that could replace consultation with a qualified Indonesian lawyer.`
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    
    // Save question and response to database for analytics
    await supabase.from('ai_interactions').insert({
      user_id: req.user.id,
      question: question,
      response: aiResponse,
      created_at: new Date().toISOString()
    });

    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing AI request' });
  }
});

// @desc    Upload legal document for indexing
// @route   POST /api/ai/upload-document
// @access  Private
router.post('/upload-document', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Create embedding for the document content
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content,
    });
    
    const documentEmbedding = embeddingResponse.data[0].embedding;
    
    // Index in Pinecone
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    
    await pineconeIndex.upsert([{
      id: `doc_${Date.now()}_${req.user.id}`,
      values: documentEmbedding,
      metadata: {
        title: title,
        text: content,
        user_id: req.user.id,
        created_at: new Date().toISOString()
      }
    }]);
    
    // Save document reference to Supabase
    const { data: document, error } = await supabase
      .from('documents')
      .insert([{
        user_id: req.user.id,
        title: title,
        content: content,
        document_type: 'legal',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: 'Error saving document' });
    }

    res.status(201).json({ document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error uploading document' });
  }
});

// @desc    Analyze contract
// @route   POST /api/ai/analyze-contract
// @access  Private
router.post('/analyze-contract', protect, async (req, res) => {
  try {
    const { contractText } = req.body;

    if (!contractText) {
      return res.status(400).json({ message: 'Contract text is required' });
    }

    // Create GPT-4 completion to analyze contract
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI contract analyzer specialized in Indonesian legal contracts. Identify key clauses, potential risks, obligations, and suggest improvements. Focus on compliance with Indonesian law.`
        },
        {
          role: "user",
          content: `Analyze the following contract and provide a summary of key clauses, potential risks, obligations of each party, and compliance issues:\n\n${contractText}`
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    const analysis = response.choices[0].message.content;
    
    // Save analysis to database
    const { data: savedAnalysis, error } = await supabase
      .from('contract_analyses')
      .insert([{
        user_id: req.user.id,
        contract_text: contractText,
        analysis: analysis,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: 'Error saving contract analysis' });
    }

    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error analyzing contract' });
  }
});

module.exports = router;