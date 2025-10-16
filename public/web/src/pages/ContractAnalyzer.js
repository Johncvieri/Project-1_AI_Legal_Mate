import React, { useState } from 'react';
import { FaFileContract, FaUpload, FaDownload, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const ContractAnalyzer = () => {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // For demo purposes, read the file if it's a text file
      if (uploadedFile.type === 'text/plain' || uploadedFile.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setContractText(e.target.result);
        };
        reader.readAsText(uploadedFile);
      } else {
        // For other file types (PDF, DOC, etc.), we'd need backend processing
        alert('File uploaded. In a real application, PDF and DOC files would be processed on the backend.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      alert('Please enter contract text or upload a file');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/analyze-contract`, {
        contractText
      });

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing contract:', error);
      setAnalysis('Error occurred while analyzing the contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContractText('');
    setAnalysis(null);
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="contract-analyzer-page">
      <div className="container">
        <div className="page-header">
          <h1><FaFileContract /> Contract Analyzer</h1>
          <p>Get AI-powered analysis of your legal contracts</p>
        </div>

        <div className="analyzer-container">
          <div className="input-section">
            <div className="upload-area">
              <div className="upload-icon">
                <FaUpload size={40} color="var(--primary-color)" />
              </div>
              <p>Upload your contract file or paste the text below</p>
              <input 
                type="file" 
                id="file-upload" 
                accept=".pdf,.doc,.docx,.txt" 
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-btn">
                Choose File
              </label>
              {file && <p className="file-name">Selected: {file.name}</p>}
            </div>

            <div className="text-input">
              <label htmlFor="contract-text">Contract Text</label>
              <textarea
                id="contract-text"
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract text here or upload a file..."
                rows="15"
              ></textarea>
            </div>

            <div className="actions">
              <button 
                className="btn btn-primary" 
                onClick={handleAnalyze} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaRobot /> Analyze Contract
                  </>
                )}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>

          {analysis && (
            <div className="analysis-section">
              <div className="analysis-header">
                <h2><FaFileContract /> Analysis Results</h2>
              </div>
              
              <div className="analysis-content">
                {analysis.includes('Error') ? (
                  <div className="error-message">
                    <FaExclamationTriangle color="var(--danger-color)" /> {analysis}
                  </div>
                ) : (
                  <div className="analysis-text">
                    {analysis}
                  </div>
                )}
              </div>

              <div className="analysis-actions">
                <button className="btn btn-outline">
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
          )}

          {!analysis && (
            <div className="help-section">
              <h3>How Contract Analysis Works</h3>
              <ul>
                <li>Upload a contract document or paste the text</li>
                <li>Our AI analyzes the contract for key clauses</li>
                <li>Review potential risks and recommendations</li>
                <li>Receive suggestions for improvements</li>
              </ul>
              
              <div className="tips">
                <h4>Tips for Better Analysis</h4>
                <ul>
                  <li>Provide complete contract text for accurate analysis</li>
                  <li>Ensure text is clear and legible</li>
                  <li>Highlight specific areas of concern</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractAnalyzer;