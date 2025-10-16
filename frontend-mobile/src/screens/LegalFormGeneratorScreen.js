import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const LegalFormGeneratorScreen = () => {
  const [formData, setFormData] = useState({
    formType: 'contract',
    title: '',
    description: '',
    clientName: '',
    clientAddress: '',
    otherParty: '',
    terms: '',
    duration: '',
    jurisdiction: 'Indonesia',
  });
  
  const [generatedForm, setGeneratedForm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const formTypes = [
    { id: 'contract', name: 'General Contract' },
    { id: 'nda', name: 'Non-Disclosure Agreement' },
    { id: 'lease', name: 'Lease Agreement' },
    { id: 'power-of-attorney', name: 'Power of Attorney' },
    { id: 'warranty', name: 'Warranty Agreement' },
  ];

  const handleGenerateForm = () => {
    if (!formData.title || !formData.clientName) {
      Alert.alert('Error', 'Please fill in required fields: Title and Client Name');
      return;
    }

    setIsGenerating(true);

    // Simulate form generation
    setTimeout(() => {
      const sampleForm = `LEGAL FORM: ${formData.title}

CLIENT: ${formData.clientName}
OTHER PARTY: ${formData.otherParty || 'N/A'}

DESCRIPTION: ${formData.description}

TERMS: ${formData.terms || 'Standard terms apply'}

DURATION: ${formData.duration || 'N/A'}

JURISDICTION: ${formData.jurisdiction}

This is a simulated legal form. In a real application, this would be generated based on your inputs using AI and legal templates.`;

      setGeneratedForm(sampleForm);
      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      formType: 'contract',
      title: '',
      description: '',
      clientName: '',
      clientAddress: '',
      otherParty: '',
      terms: '',
      duration: '',
      jurisdiction: 'Indonesia',
    });
    setGeneratedForm('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legal Form Generator</Text>
        <Text style={styles.headerSubtitle}>Create custom legal documents</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Form Type</Text>
          <View style={styles.picker}>
            {formTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.pickerItem, 
                  formData.formType === type.id && styles.pickerItemSelected
                ]}
                onPress={() => setFormData({...formData, formType: type.id})}
              >
                <Text style={[
                  styles.pickerItemText,
                  formData.formType === type.id && styles.pickerItemSelectedText
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Form Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
              placeholder="e.g., Service Contract"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.clientName}
              onChangeText={(text) => setFormData({...formData, clientName: text})}
              placeholder="Enter client name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Address</Text>
            <TextInput
              style={styles.input}
              value={formData.clientAddress}
              onChangeText={(text) => setFormData({...formData, clientAddress: text})}
              placeholder="Enter client address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Other Party</Text>
            <TextInput
              style={styles.input}
              value={formData.otherParty}
              onChangeText={(text) => setFormData({...formData, otherParty: text})}
              placeholder="Enter other party name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Brief description of the agreement..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Terms & Conditions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.terms}
              onChangeText={(text) => setFormData({...formData, terms: text})}
              placeholder="Specific terms to include..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(text) => setFormData({...formData, duration: text})}
                placeholder="e.g., 1 year"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Jurisdiction</Text>
              <TextInput
                style={styles.input}
                value={formData.jurisdiction}
                onChangeText={(text) => setFormData({...formData, jurisdiction: text})}
                placeholder="e.g., Indonesia"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={handleGenerateForm}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Text style={styles.generateButtonText}>Generating...</Text>
              ) : (
                <Text style={styles.generateButtonText}>Generate Form</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {generatedForm ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Generated Legal Form</Text>
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{generatedForm}</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>How It Works</Text>
            <Text style={styles.helpText}>
              1. Select a form type from the options above\n
              2. Fill in the required details\n
              3. Click "Generate Form" to create your document\n
              4. Review, edit, and download your legal document
            </Text>
            
            <Text style={styles.helpTitle}>Important Note</Text>
            <Text style={styles.helpText}>
              Generated documents are for reference only. Always consult with a legal professional before using any legal document.
            </Text>
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
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  pickerItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  pickerItemSelected: {
    backgroundColor: '#2563eb',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#64748b',
  },
  pickerItemSelectedText: {
    color: '#fff',
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  generateButton: {
    flex: 0.7,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  resetButton: {
    flex: 0.3,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  resultContent: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    maxHeight: 200,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1e293b',
  },
  downloadButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 15,
  },
});

export default LegalFormGeneratorScreen;