import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRobot, FaBook, FaFileContract, FaComments, FaCalendarCheck, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <FaRobot className="feature-icon" />,
      title: "AI Legal Assistant",
      description: "Get instant answers to your legal questions powered by GPT-4 technology"
    },
    {
      icon: <FaBook className="feature-icon" />,
      title: "Legal Education",
      description: "Interactive modules and case studies to enhance your legal knowledge"
    },
    {
      icon: <FaFileContract className="feature-icon" />,
      title: "Case Management",
      description: "Track your legal cases with progress updates and deadline reminders"
    },
    {
      icon: <FaComments className="feature-icon" />,
      title: "Community Q&A",
      description: "Connect with legal experts and fellow users in our community"
    },
    {
      icon: <FaCalendarCheck className="feature-icon" />,
      title: "Consultation Booking",
      description: "Book secure consultations with qualified Indonesian legal experts"
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with military-grade security"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay muted loop playsInline>
            <source src="/assets/videos/legal-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Your <span className="highlight">AI Legal Assistant</span> for Indonesia
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Navigate Indonesian law with confidence using our intelligent platform
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link to="/ai-assistant" className="btn btn-primary">
              Start AI Assistant
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Legal Features</h2>
            <p>Everything you need to manage your legal matters efficiently</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get legal help with AI assistance</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Ask Your Legal Question</h3>
              <p>Describe your legal issue to our AI assistant</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Instant Analysis</h3>
              <p>Receive detailed legal analysis based on Indonesian law</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect with Experts</h3>
              <p>Book consultations with qualified legal professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Navigate Your Legal Journey?</h2>
          <p>Join thousands of users who trust AI Legal Mate for their legal needs</p>
          <Link to="/register" className="btn btn-primary">Get Started Today</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;