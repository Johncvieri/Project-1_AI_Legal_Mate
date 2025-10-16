import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaBook, FaFileContract, FaComments, FaHome, FaRobot } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <FaRobot /> },
    { path: '/cases', label: 'Case Management', icon: <FaFileContract /> },
    { path: '/education', label: 'Legal Education', icon: <FaBook /> },
    { path: '/community', label: 'Community', icon: <FaComments /> },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>AI Legal Mate</h2>
        </Link>
        
        <div className="nav-menu" id="nav-menu">
          <ul className="nav-menu-list">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <li key={link.path} className="nav-menu-item">
                    <Link to={link.path} className="nav-menu-link">
                      <span className="nav-icon">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                <li className="nav-menu-item">
                  <Link to="/login" className="nav-menu-link">Login</Link>
                </li>
                <li className="nav-menu-item">
                  <Link to="/register" className="nav-menu-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {isAuthenticated && (
          <div className="nav-user">
            <div className="dropdown">
              <button className="dropdown-button">
                <FaUser /> {user?.name || 'User'}
              </button>
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="nav-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-menu-mobile ${isOpen ? 'active' : ''}`}>
        <ul className="nav-menu-list-mobile">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <li key={link.path} className="nav-menu-item-mobile" onClick={toggleMenu}>
                  <Link to={link.path} className="nav-menu-link-mobile">
                    <span className="nav-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-menu-item-mobile" onClick={toggleMenu}>
                <Link to="/profile" className="nav-menu-link-mobile">
                  <span className="nav-icon"><FaUser /></span>
                  Profile
                </Link>
              </li>
              <li className="nav-menu-item-mobile">
                <button onClick={handleLogout} className="nav-menu-link-mobile">
                  <span className="nav-icon"><FaSignOutAlt /></span>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-menu-item-mobile" onClick={toggleMenu}>
                <Link to="/login" className="nav-menu-link-mobile">Login</Link>
              </li>
              <li className="nav-menu-item-mobile" onClick={toggleMenu}>
                <Link to="/register" className="nav-menu-link-mobile">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;