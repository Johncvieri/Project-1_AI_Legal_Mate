import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaRobot, FaFileContract, FaBook, FaComments, FaCalendarCheck, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cases: 0,
    documents: 0,
    consultations: 0,
    aiInteractions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [casesRes, docsRes, consultRes, aiRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/cases`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/documents`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/consultations`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/ai/interactions`)
        ]);

        setStats({
          cases: casesRes.data.length,
          documents: docsRes.data.length,
          consultations: consultRes.data.length,
          aiInteractions: aiRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "AI Assistant",
      description: "Get legal advice",
      icon: <FaRobot />,
      link: "/ai-assistant",
      color: "var(--primary-color)"
    },
    {
      title: "Case Management",
      description: "Track your cases",
      icon: <FaFileContract />,
      link: "/cases",
      color: "var(--secondary-color)"
    },
    {
      title: "Legal Education",
      description: "Learn about law",
      icon: <FaBook />,
      link: "/education",
      color: "var(--accent-color)"
    },
    {
      title: "Consultation",
      description: "Book appointment",
      icon: <FaCalendarCheck />,
      link: "/consultation",
      color: "var(--success-color)"
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{user?.name}</strong>!</p>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-color-light)' }}>
              <FaFileContract />
            </div>
            <div className="stat-info">
              <h3>{stats.cases}</h3>
              <p>Cases</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-color-light)' }}>
              <FaShieldAlt />
            </div>
            <div className="stat-info">
              <h3>{stats.documents}</h3>
              <p>Documents</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-color-light)' }}>
              <FaCalendarCheck />
            </div>
            <div className="stat-info">
              <h3>{stats.consultations}</h3>
              <p>Consultations</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-color-light)' }}>
              <FaRobot />
            </div>
            <div className="stat-info">
              <h3>{stats.aiInteractions}</h3>
              <p>AI Interactions</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="quick-action-card">
                <div className="quick-action-icon" style={{ backgroundColor: action.color + '20', color: action.color }}>
                  {action.icon}
                </div>
                <div className="quick-action-info">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <FaRobot />
              </div>
              <div className="activity-content">
                <h4>AI Legal Assistant</h4>
                <p>Asked about contract law</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <FaFileContract />
              </div>
              <div className="activity-content">
                <h4>Case Update</h4>
                <p>Your case "Contract Dispute" status updated to In Progress</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <FaBook />
              </div>
              <div className="activity-content">
                <h4>Legal Education</h4>
                <p>Completed module on "Basics of Indonesian Law"</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;