import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const features = [
    { id: 1, name: 'AI Assistant', route: 'AIAssistant', color: '#2563eb' },
    { id: 2, name: 'Case Management', route: 'CaseManagement', color: '#7c3aed' },
    { id: 3, name: 'Legal Education', route: 'LegalEducation', color: '#059669' },
    { id: 4, name: 'Contract Analyzer', route: 'ContractAnalyzer', color: '#f59e0b' },
    { id: 5, name: 'Consultation', route: 'ConsultationBooking', color: '#ef4444' },
    { id: 6, name: 'Profile', route: 'Profile', color: '#8b5cf6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Legal Mate</Text>
        <Text style={styles.subtitle}>Your Legal Assistant in Your Pocket</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: feature.color }]}
              onPress={() => navigation.navigate(feature.route)}
            >
              <Text style={styles.featureText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <Text style={styles.infoText}>
          Ask legal questions, manage cases, access legal education, and more - all from your mobile device.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    margin: 24,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default HomeScreen;