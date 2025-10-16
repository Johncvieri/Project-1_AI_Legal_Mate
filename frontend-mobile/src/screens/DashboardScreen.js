import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cases: 0,
    documents: 0,
    consultations: 0,
    aiInteractions: 0
  });

  useEffect(() => {
    // In a real app, we would fetch user stats from the API
    // For demo purposes, we're using mock data
    setStats({
      cases: 3,
      documents: 5,
      consultations: 2,
      aiInteractions: 12
    });
  }, []);

  const quickActions = [
    { id: 1, title: 'AI Assistant', icon: '🤖', color: '#2563eb', screen: 'AIAssistant' },
    { id: 2, title: 'Case Management', icon: '📋', color: '#7c3aed', screen: 'CaseManagement' },
    { id: 3, title: 'Legal Education', icon: '🎓', color: '#059669', screen: 'LegalEducation' },
    { id: 4, title: 'Profile', icon: '👤', color: '#8b5cf6', screen: 'Profile' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || 'User'}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.cases}</Text>
            <Text style={styles.statLabel}>Cases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.documents}</Text>
            <Text style={styles.statLabel}>Documents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.consultations}</Text>
            <Text style={styles.statLabel}>Consultations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.aiInteractions}</Text>
            <Text style={styles.statLabel}>AI Interactions</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionCard, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Text style={styles.activityIconText}>🤖</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>AI Legal Assistant</Text>
            <Text style={styles.activitySubtitle}>Asked about contract law</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Text style={styles.activityIconText}>📋</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Case Update</Text>
            <Text style={styles.activitySubtitle}>Contract Dispute case status updated</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Text style={styles.activityIconText}>🎓</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Legal Education</Text>
            <Text style={styles.activitySubtitle}>Completed module on Basics of Law</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 5,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    width: (width - 50) / 2,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 5,
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 50) / 2 - 10,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentActivityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 5,
  },
});

export default DashboardScreen;