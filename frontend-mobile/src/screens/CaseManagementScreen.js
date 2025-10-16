import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';

const CaseManagementScreen = () => {
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'Contract Dispute',
      description: 'Dispute regarding terms of service agreement',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2023-05-15'),
    },
    {
      id: 2,
      title: 'Property Lease',
      description: 'Residential lease agreement review',
      status: 'open',
      priority: 'medium',
      createdAt: new Date('2023-06-20'),
    },
    {
      id: 3,
      title: 'Employment Contract',
      description: 'Review of employee terms and conditions',
      status: 'completed',
      priority: 'low',
      createdAt: new Date('2023-04-10'),
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'open': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const handleAddCase = () => {
    if (!newCase.title.trim()) {
      Alert.alert('Error', 'Please enter a case title');
      return;
    }

    const caseToAdd = {
      id: Date.now(),
      ...newCase,
      createdAt: new Date(),
    };

    setCases([caseToAdd, ...cases]);
    setNewCase({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    });
    setShowForm(false);
  };

  const renderCaseItem = ({ item }) => (
    <View style={styles.caseItem}>
      <View style={styles.caseHeader}>
        <Text style={styles.caseTitle}>{item.title}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.caseDescription}>{item.description}</Text>
      <Text style={styles.caseDate}>
        Created: {item.createdAt.toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Case Management</Text>
        <Text style={styles.headerSubtitle}>Track and manage your legal cases</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>+ Add New Case</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Case</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Case Title"
            value={newCase.title}
            onChangeText={(text) => setNewCase({...newCase, title: text})}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Case Description"
            value={newCase.description}
            onChangeText={(text) => setNewCase({...newCase, description: text})}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.picker}>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, status: 'open'})}
                >
                  <Text style={newCase.status === 'open' ? styles.pickerItemSelected : styles.pickerItemText}>
                    Open
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, status: 'in_progress'})}
                >
                  <Text style={newCase.status === 'in_progress' ? styles.pickerItemSelected : styles.pickerItemText}>
                    In Progress
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, status: 'completed'})}
                >
                  <Text style={newCase.status === 'completed' ? styles.pickerItemSelected : styles.pickerItemText}>
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.rowItem}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.picker}>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, priority: 'low'})}
                >
                  <Text style={newCase.priority === 'low' ? styles.pickerItemSelected : styles.pickerItemText}>
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, priority: 'medium'})}
                >
                  <Text style={newCase.priority === 'medium' ? styles.pickerItemSelected : styles.pickerItemText}>
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => setNewCase({...newCase, priority: 'high'})}
                >
                  <Text style={newCase.priority === 'high' ? styles.pickerItemSelected : styles.pickerItemText}>
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddCase}>
              <Text style={styles.saveButtonText}>Add Case</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={cases}
        renderItem={renderCaseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  controls: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  caseItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  caseDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  caseDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default CaseManagementScreen;