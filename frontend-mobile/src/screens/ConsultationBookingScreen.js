import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ConsultationBookingScreen = () => {
  const [consultationData, setConsultationData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    lawyerSpecialty: 'general',
  });
  const [bookingStep, setBookingStep] = useState(1); // 1 = details, 2 = confirmation

  const handleBookConsultation = () => {
    if (!consultationData.title || !consultationData.date || !consultationData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setBookingStep(2);
  };

  const confirmBooking = () => {
    Alert.alert(
      'Booking Confirmed',
      'Your consultation has been booked successfully!',
      [
        { 
          text: 'OK', 
          onPress: () => {
            setBookingStep(1);
            setConsultationData({
              title: '',
              description: '',
              date: '',
              time: '',
              duration: '60',
              lawyerSpecialty: 'general',
            });
          }
        }
      ]
    );
  };

  const specialties = [
    { id: 'general', name: 'General Legal Advice' },
    { id: 'contract', name: 'Contract Law' },
    { id: 'corporate', name: 'Corporate Law' },
    { id: 'family', name: 'Family Law' },
    { id: 'property', name: 'Property Law' },
    { id: 'criminal', name: 'Criminal Law' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Consultation</Text>
        <Text style={styles.headerSubtitle}>Schedule a meeting with a legal expert</Text>
      </View>

      <ScrollView style={styles.content}>
        {bookingStep === 1 ? (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consultation Title *</Text>
              <TextInput
                style={styles.input}
                value={consultationData.title}
                onChangeText={(text) => setConsultationData({...consultationData, title: text})}
                placeholder="e.g., Contract Review Meeting"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={consultationData.description}
                onChangeText={(text) => setConsultationData({...consultationData, description: text})}
                placeholder="Brief description of your consultation needs..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.input}
                  value={consultationData.date}
                  onChangeText={(text) => setConsultationData({...consultationData, date: text})}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Time *</Text>
                <TextInput
                  style={styles.input}
                  value={consultationData.time}
                  onChangeText={(text) => setConsultationData({...consultationData, time: text})}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  value={consultationData.duration}
                  onChangeText={(text) => setConsultationData({...consultationData, duration: text})}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Lawyer Specialty</Text>
                <View style={styles.picker}>
                  <TouchableOpacity style={styles.pickerItem} onPress={() => setConsultationData({...consultationData, lawyerSpecialty: 'general'})}>
                    <Text style={consultationData.lawyerSpecialty === 'general' ? styles.pickerItemSelected : styles.pickerItemText}>General</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pickerItem} onPress={() => setConsultationData({...consultationData, lawyerSpecialty: 'contract'})}>
                    <Text style={consultationData.lawyerSpecialty === 'contract' ? styles.pickerItemSelected : styles.pickerItemText}>Contract</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookConsultation}>
              <Text style={styles.bookButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>Review Your Booking</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Title:</Text>
              <Text style={styles.summaryValue}>{consultationData.title}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{consultationData.date}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{consultationData.time}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{consultationData.duration} minutes</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Specialty:</Text>
              <Text style={styles.summaryValue}>
                {specialties.find(s => s.id === consultationData.lawyerSpecialty)?.name}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Description:</Text>
              <Text style={styles.summaryValue}>{consultationData.description || 'N/A'}</Text>
            </View>

            <View style={styles.paymentContainer}>
              <Text style={styles.paymentTitle}>Secure Payment</Text>
              <Text style={styles.paymentSubtitle}>Please complete your payment to confirm booking</Text>
              
              <TouchableOpacity style={styles.payButton} onPress={confirmBooking}>
                <Text style={styles.payButtonText}>Pay & Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  picker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerItem: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#64748b',
  },
  pickerItemSelected: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 0.4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
    flex: 0.6,
    textAlign: 'right',
  },
  paymentContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConsultationBookingScreen;