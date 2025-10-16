import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCalendar, FaFile, FaCog, FaSave } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, formData);
      setUser({ ...user, ...formData });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }
    
    try {
      // In a real app, this would send the password change request
      // For this demo, we'll just show a success message
      alert('Password would be changed in a real application');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1><FaUser /> Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <FaUser size={60} />
              </div>
              <h2>{user.name}</h2>
              <p className="user-role">{user.role}</p>
              <p className="user-email">{user.email}</p>
            </div>

            <div className="sidebar-menu">
              <a href="#profile" className="menu-item active">
                <FaUser /> Profile Information
              </a>
              <a href="#security" className="menu-item">
                <FaLock /> Security
              </a>
              <a href="#documents" className="menu-item">
                <FaFile /> Documents
              </a>
              <a href="#settings" className="menu-item">
                <FaCog /> Settings
              </a>
            </div>
          </div>

          <div className="profile-content">
            <div id="profile" className="content-section">
              <h2>Profile Information</h2>
              
              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="role">Account Type</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled
                    >
                      <option value="user">Standard User</option>
                      <option value="lawyer">Legal Professional</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <p className="help-text">Account type cannot be changed</p>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <FaSave /> Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          role: user.role
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <h3>Full Name</h3>
                      <p>{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaEnvelope className="info-icon" />
                    <div>
                      <h3>Email Address</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaCalendar className="info-icon" />
                    <div>
                      <h3>Account Type</h3>
                      <p>{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaCalendar className="info-icon" />
                    <div>
                      <h3>Member Since</h3>
                      <p>{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div id="security" className="content-section">
              <h2>Security</h2>
              
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;