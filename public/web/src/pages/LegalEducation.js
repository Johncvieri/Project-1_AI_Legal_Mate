import React, { useState, useEffect } from 'react';
import { FaBook, FaPlay, FaCheck, FaLock, FaStar, FaClock } from 'react-icons/fa';
import axios from 'axios';

const LegalEducation = () => {
  const [modules, setModules] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationModules();
  }, []);

  const fetchEducationModules = async () => {
    try {
      // For demo purposes, we'll create mock data
      // In a real app, this would come from the backend API
      const mockModules = [
        {
          id: 1,
          title: 'Introduction to Indonesian Law',
          description: 'Learn the basics of the Indonesian legal system',
          category: 'basics',
          difficulty_level: 'beginner',
          duration: 30,
          video_url: '',
          thumbnail_url: '',
          completed: false
        },
        {
          id: 2,
          title: 'Contract Law Fundamentals',
          description: 'Understanding essential principles of contract law in Indonesia',
          category: 'contracts',
          difficulty_level: 'intermediate',
          duration: 45,
          video_url: '',
          thumbnail_url: '',
          completed: true
        },
        {
          id: 3,
          title: 'Corporate Law Overview',
          description: 'Key concepts in Indonesian corporate law',
          category: 'corporate',
          difficulty_level: 'intermediate',
          duration: 60,
          video_url: '',
          thumbnail_url: '',
          completed: false
        },
        {
          id: 4,
          title: 'Family Law in Indonesia',
          description: 'Legal aspects of marriage, divorce, and family relations',
          category: 'family',
          difficulty_level: 'beginner',
          duration: 40,
          video_url: '',
          thumbnail_url: '',
          completed: false
        },
        {
          id: 5,
          title: 'Property Law Essentials',
          description: 'Understanding property rights and regulations',
          category: 'property',
          difficulty_level: 'intermediate',
          duration: 50,
          video_url: '',
          thumbnail_url: '',
          completed: false
        },
        {
          id: 6,
          title: 'Employment Law Basics',
          description: 'Rights and obligations in employer-employee relationships',
          category: 'employment',
          difficulty_level: 'beginner',
          duration: 35,
          video_url: '',
          thumbnail_url: '',
          completed: true
        }
      ];
      
      setModules(mockModules);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching education modules:', error);
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'basics', label: 'Basics' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'family', label: 'Family' },
    { value: 'property', label: 'Property' },
    { value: 'employment', label: 'Employment' }
  ];

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading education modules...</p>
      </div>
    );
  }

  return (
    <div className="legal-education-page">
      <div className="container">
        <div className="page-header">
          <h1><FaBook /> Legal Education</h1>
          <p>Expand your legal knowledge with interactive modules</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category">Filter by Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modules-grid">
          {filteredModules.length === 0 ? (
            <div className="no-data">
              <FaBook size={60} color="var(--text-color-secondary)" />
              <h3>No modules found</h3>
              <p>Check back later for new educational content</p>
            </div>
          ) : (
            filteredModules.map(module => (
              <div key={module.id} className="module-card">
                <div className="module-image">
                  {module.thumbnail_url ? (
                    <img src={module.thumbnail_url} alt={module.title} />
                  ) : (
                    <div className="placeholder-image">
                      <FaBook size={40} color="var(--text-color-secondary)" />
                    </div>
                  )}
                  {module.completed ? (
                    <div className="completed-badge">
                      <FaCheck />
                    </div>
                  ) : (
                    <button className="play-btn">
                      <FaPlay />
                    </button>
                  )}
                </div>
                
                <div className="module-content">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  
                  <div className="module-meta">
                    <div className="meta-item">
                      <FaClock />
                      <span>{module.duration} min</span>
                    </div>
                    <div className={`meta-item difficulty-${getDifficultyColor(module.difficulty_level)}`}>
                      <FaStar />
                      <span>{module.difficulty_level}</span>
                    </div>
                  </div>
                  
                  <div className="module-actions">
                    <button className="btn btn-primary">
                      {module.completed ? 'Review' : 'Start Learning'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="education-features">
          <div className="feature-section">
            <h3>Why Legal Education Matters</h3>
            <p>Understanding legal principles helps you make informed decisions and navigate complex situations with confidence.</p>
          </div>
          
          <div className="feature-section">
            <h3>Expert-Created Content</h3>
            <p>Our modules are developed by experienced Indonesian legal professionals to ensure accuracy and relevance.</p>
          </div>
          
          <div className="feature-section">
            <h3>Track Your Progress</h3>
            <p>Monitor your learning journey and identify areas for further study.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalEducation;