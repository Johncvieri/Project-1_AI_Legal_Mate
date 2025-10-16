import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './src/contexts/AuthContext';
import { NotificationContext } from './src/contexts/NotificationContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import CaseManagementScreen from './src/screens/CaseManagementScreen';
import LegalEducationScreen from './src/screens/LegalEducationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DocumentSearchScreen from './src/screens/DocumentSearchScreen';
import ContractAnalyzerScreen from './src/screens/ContractAnalyzerScreen';
import ConsultationBookingScreen from './src/screens/ConsultationBookingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Cases" component={CaseManagementScreen} />
      <Tab.Screen name="Education" component={LegalEducationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Simulate auth check
  useEffect(() => {
    // In a real app, you would check for a stored token
    const storedToken = null; // get from async storage
    if (storedToken) {
      // Verify token with backend
      setIsAuthenticated(true);
      // setUser({...}); // set user data
    }
  }, []);

  const login = (userData, userToken) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const authContextValue = {
    isAuthenticated,
    user,
    token,
    login,
    logout
  };

  const notificationContextValue = {
    // Notification methods would go here
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <NotificationContext.Provider value={notificationContextValue}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isAuthenticated ? "Main" : "Login"}>
            {isAuthenticated ? (
              <Stack.Screen 
                name="Main" 
                component={MainTabs}
                options={{ headerShown: false }}
              />
            ) : (
              <>
                <Stack.Screen 
                  name="Login" 
                  component={LoginScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Register" 
                  component={RegisterScreen} 
                  options={{ headerShown: false }}
                />
              </>
            )}
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
            <Stack.Screen name="CaseManagement" component={CaseManagementScreen} />
            <Stack.Screen name="LegalEducation" component={LegalEducationScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="DocumentSearch" component={DocumentSearchScreen} />
            <Stack.Screen name="ContractAnalyzer" component={ContractAnalyzerScreen} />
            <Stack.Screen name="ConsultationBooking" component={ConsultationBookingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;