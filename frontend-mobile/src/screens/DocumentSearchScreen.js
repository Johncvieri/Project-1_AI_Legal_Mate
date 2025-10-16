import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';

const DocumentSearchScreen = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Lease Agreement',
      description: 'Annual property lease agreement',
      type: 'agreement',
      date: '2023-09-15',
      tags: ['property', 'lease'],
    },
    {
      id: 2,
      title: 'Employment Contract',
      description: 'Employee terms and conditions',
      type: 'contract',
      date: '2023-08-20',
      tags: ['employment', 'contract'],
    },
    {
      id: 3,
      title: 'Power of Attorney',
      description: 'Legal authorization document',
      type: 'authorization',
      date: '2023-07-10',
      tags: ['authorization', 'legal'],
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    type: 'document',
  });

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUploadDocument = () => {
    if (!newDocument.title.trim()) {
      Alert.alert('Error', 'Please enter a document title');
      return;
    }

    const documentToAdd = {
      id: Date.now(),
      title: newDocument.title,
      description: newDocument.description,
      type: newDocument.type,
      date: new Date().toISOString().split('T')[0],
      tags: [],
    };

    setDocuments([documentToAdd, ...documents]);
    setNewDocument({ title: '', description: '', type: 'document' });
    setShowUploadForm(false);
  };

  const renderDocumentItem = ({ item }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentType}>{item.type}</Text>
        <Text style={styles.documentDate}>{item.date}</Text>
      </View>
      
      <Text style={styles.documentTitle}>{item.title}</Text>
      <Text style={styles.documentDescription}>{item.description}</Text>
      
      <View style={styles.documentActions}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Search</Text>
        <Text style={styles.headerSubtitle}>Search and manage your legal documents</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={() => setShowUploadForm(!showUploadForm)}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {showUploadForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Upload New Document</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Document title"
            value={newDocument.title}
            onChangeText={(text) => setNewDocument({...newDocument, title: text})}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={newDocument.description}
            onChangeText={(text) => setNewDocument({...newDocument, description: text})}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.picker}>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewDocument({...newDocument, type: 'document'})}
            >
              <Text style={newDocument.type === 'document' ? styles.pickerItemSelected : styles.pickerItemText}>
                Document
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewDocument({...newDocument, type: 'contract'})}
            >
              <Text style={newDocument.type === 'contract' ? styles.pickerItemSelected : styles.pickerItemText}>
                Contract
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewDocument({...newDocument, type: 'agreement'})}
            >
              <Text style={newDocument.type === 'agreement' ? styles.pickerItemSelected : styles.pickerItemText}>
                Agreement
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowUploadForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleUploadDocument}>
              <Text style={styles.saveButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={filteredDocuments}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.documentsList}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
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
  picker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
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
  documentsList: {
    padding: 20,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  documentType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  documentDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  viewButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DocumentSearchScreen;