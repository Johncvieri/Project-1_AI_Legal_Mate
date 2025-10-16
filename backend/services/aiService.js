// AI Service for AI Legal Mate
// Handles GPT-4 integration and Pinecone vector search

const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    this.index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME);
  }

  // Generate embeddings for text
  async generateEmbedding(text) {
    try {
      const embeddingResponse = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });
      
      return embeddingResponse.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  // Store document in Pinecone
  async storeDocument(text, metadata) {
    try {
      const embedding = await this.generateEmbedding(text);
      
      const upsertResponse = await this.index.upsert([{
        id: `doc_${Date.now()}_${metadata.userId || 'anonymous'}`,
        values: embedding,
        metadata: {
          ...metadata,
          created_at: new Date().toISOString()
        }
      }]);
      
      return upsertResponse;
    } catch (error) {
      console.error('Error storing document in Pinecone:', error);
      throw error;
    }
  }

  // Query Pinecone for similar content
  async queryDocuments(query, topK = 5) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      const queryResponse = await this.index.query({
        vector: queryEmbedding,
        topK: topK,
        includeMetadata: true
      });
      
      return queryResponse.matches;
    } catch (error) {
      console.error('Error querying Pinecone:', error);
      throw error;
    }
  }

  // Generate legal response using GPT-4
  async generateLegalResponse(question, context = '') {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
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

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating legal response:', error);
      throw error;
    }
  }

  // Analyze legal document
  async analyzeDocument(documentText) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI legal document analyzer specialized in Indonesian legal documents. Identify key clauses, potential risks, obligations, and suggest improvements. Focus on compliance with Indonesian law.`
          },
          {
            role: "user",
            content: `Analyze the following legal document and provide a summary of key clauses, potential risks, obligations of each party, and compliance issues:\n\n${documentText}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }

  // Generate legal forms
  async generateLegalForm(formType, parameters) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI legal form generator specialized in Indonesian legal forms. Generate compliant and accurate legal documents following Indonesian legal standards.`
          },
          {
            role: "user",
            content: `Generate an Indonesian legal form of type: ${formType}. Parameters: ${JSON.stringify(parameters)}. Ensure the form complies with Indonesian law and includes all necessary clauses.`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating legal form:', error);
      throw error;
    }
  }
}

module.exports = new AIService();