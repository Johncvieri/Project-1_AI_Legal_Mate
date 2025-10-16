import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaFileUpload } from 'react-icons/fa';
import axios from 'axios';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/ask`, {
        question
      });

      const newMessage = {
        id: Date.now(),
        user: 'user',
        text: question,
        timestamp: new Date().toISOString()
      };

      const aiMessage = {
        id: Date.now() + 1,
        user: 'ai',
        text: response.data.response,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, newMessage, aiMessage]);
      setResponse(response.data.response);
      setQuestion('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now(),
        user: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', file.name);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedDocument(response.data.document);
      // Add a message to chat history
      const uploadMessage = {
        id: Date.now(),
        user: 'system',
        text: `Document "${file.name}" uploaded successfully and indexed for AI analysis.`,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, uploadMessage]);
    } catch (error) {
      console.error('Error uploading document:', error);
      const errorMessage = {
        id: Date.now(),
        user: 'ai',
        text: 'Error uploading document. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResponse('');
  };

  return (
    <div className="ai-assistant-page">
      <div className="container">
        <div className="page-header">
          <h1><FaRobot /> AI Legal Assistant</h1>
          <p>Ask any legal question related to Indonesian law</p>
        </div>

        <div className="ai-content">
          <div className="chat-container">
            <div className="chat-messages">
              {chatHistory.length === 0 ? (
                <div className="welcome-message">
                  <h3>Hello! I'm your AI Legal Assistant</h3>
                  <p>Ask me anything about Indonesian law and I'll provide you with accurate information.</p>
                  <p>You can also upload legal documents for analysis.</p>
                </div>
              ) : (
                chatHistory.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.user}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-content">
                      <div className="message-text">
                        {message.text}
                      </div>
                      <div className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <div className="message ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
              <div className="input-group">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a legal question..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !question.trim()}>
                  <FaPaperPlane />
                </button>
              </div>
              <div className="chat-actions">
                <label className="upload-btn">
                  <FaFileUpload />
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt" 
                    onChange={handleDocumentUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button type="button" onClick={clearChat} className="btn btn-secondary">
                  Clear Chat
                </button>
              </div>
            </form>
          </div>

          <div className="ai-features">
            <div className="feature-card">
              <h3>How It Works</h3>
              <ul>
                <li>Ask legal questions in natural language</li>
                <li>Get responses based on Indonesian law</li>
                <li>Upload legal documents for analysis</li>
                <li>Access previous conversations</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>Legal Areas Covered</h3>
              <ul>
                <li>Contract Law</li>
                <li>Corporate Law</li>
                <li>Family Law</li>
                <li>Property Law</li>
                <li>Employment Law</li>
                <li>Criminal Law</li>
              </ul>
            </div>

            <div className="feature-card">
              <h3>Tips for Best Results</h3>
              <ul>
                <li>Be specific with your questions</li>
                <li>Provide context when possible</li>
                <li>Upload relevant documents for analysis</li>
                <li>Verify information with a legal professional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;