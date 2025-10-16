import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaGavel, FaFileContract } from 'react-icons/fa';
import axios from 'axios';

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    case_type: 'general',
    status: 'open',
    priority: 'medium',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cases`);
      setCases(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentCase) {
        // Update existing case
        await axios.put(`${process.env.REACT_APP_API_URL}/api/cases/${currentCase.id}`, formData);
      } else {
        // Create new case
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cases`, formData);
      }
      
      fetchCases();
      resetForm();
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleEdit = (caseItem) => {
    setCurrentCase(caseItem);
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      case_type: caseItem.case_type,
      status: caseItem.status,
      priority: caseItem.priority,
      deadline: caseItem.deadline ? caseItem.deadline.substring(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cases/${id}`);
        fetchCases();
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      case_type: 'general',
      status: 'open',
      priority: 'medium',
      deadline: ''
    });
    setCurrentCase(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'open': return 'secondary';
      case 'closed': return 'dark';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cases...</p>
      </div>
    );
  }

  return (
    <div className="case-management-page">
      <div className="container">
        <div className="page-header">
          <h1><FaGavel /> Case Management</h1>
          <p>Track and manage your legal cases</p>
        </div>

        <div className="page-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FaPlus /> Add New Case
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <div className="form-card">
              <h3>{currentCase ? 'Edit Case' : 'Create New Case'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Case Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="case_type">Case Type</label>
                    <select
                      id="case_type"
                      name="case_type"
                      value={formData.case_type}
                      onChange={handleInputChange}
                    >
                      <option value="general">General</option>
                      <option value="criminal">Criminal</option>
                      <option value="civil">Civil</option>
                      <option value="corporate">Corporate</option>
                      <option value="family">Family</option>
                      <option value="property">Property</option>
                      <option value="employment">Employment</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {currentCase ? 'Update Case' : 'Create Case'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="cases-grid">
          {cases.length === 0 ? (
            <div className="no-data">
              <FaFileContract size={60} color="var(--text-color-secondary)" />
              <h3>No cases found</h3>
              <p>Create your first case to get started</p>
            </div>
          ) : (
            cases.map((caseItem) => (
              <div key={caseItem.id} className="case-card">
                <div className="case-header">
                  <h3>{caseItem.title}</h3>
                  <div className="case-badges">
                    <span className={`badge badge-${getStatusColor(caseItem.status)}`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                    <span className={`badge badge-${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </div>
                </div>
                
                <div className="case-body">
                  <p className="case-description">{caseItem.description}</p>
                  
                  <div className="case-meta">
                    <div className="meta-item">
                      <FaFileContract />
                      <span>{caseItem.case_type}</span>
                    </div>
                    {caseItem.deadline && (
                      <div className="meta-item">
                        <FaClock />
                        <span>{new Date(caseItem.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="case-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleEdit(caseItem)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleDelete(caseItem.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;