import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import CaseManagement from './pages/CaseManagement';
import LegalEducation from './pages/LegalEducation';
import DocumentSearch from './pages/DocumentSearch';
import ContractAnalyzer from './pages/ContractAnalyzer';
import ConsultationBooking from './pages/ConsultationBooking';
import CommunityQnA from './pages/CommunityQnA';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import './styles/App.css';
import './styles/variables.css';
import './styles/Navbar.css';
import './styles/Footer.css';
import './styles/Home.css';
import './styles/Auth.css';
import './styles/Dashboard.css';
import './styles/AIAssistant.css';
import './styles/Components.css';
import './styles/Animations.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/ai-assistant" 
                    element={
                      <PrivateRoute>
                        <AIAssistant />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/cases" 
                    element={
                      <PrivateRoute>
                        <CaseManagement />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/education" 
                    element={
                      <PrivateRoute>
                        <LegalEducation />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/documents" 
                    element={
                      <PrivateRoute>
                        <DocumentSearch />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/contract-analyzer" 
                    element={
                      <PrivateRoute>
                        <ContractAnalyzer />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/consultation" 
                    element={
                      <PrivateRoute>
                        <ConsultationBooking />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/community" 
                    element={
                      <PrivateRoute>
                        <CommunityQnA />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;