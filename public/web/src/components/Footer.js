import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AI Legal Mate</h3>
          <p>Your intelligent legal assistant for Indonesian law</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ai-assistant">AI Assistant</Link></li>
            <li><Link to="/cases">Case Management</Link></li>
            <li><Link to="/education">Legal Education</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>support@ailawmate.com</li>
            <li>+62 123 4567 8900</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AI Legal Mate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;