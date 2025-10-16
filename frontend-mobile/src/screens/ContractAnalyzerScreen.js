import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ContractAnalyzerScreen = () => {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!contractText.trim()) {
      Alert.alert('Error', 'Please enter contract text to analyze');
      return;
    }

    setLoading(true);

    // Simulate analysis
    setTimeout(() => {
      setAnalysis(`Contract Analysis Results:\n\n1. Key Clauses: Payment terms, termination conditions, dispute resolution\n2. Potential Risks: Late payment penalties, unilateral changes\n3. Recommendations: Clarify termination conditions, add force majeure clause\n4. Compliance: Adheres to Indonesian contract law principles`);
      setLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setContractText('');
    setAnalysis('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contract Analyzer</Text>
        <Text style={styles.headerSubtitle}>Get AI-powered analysis of your contracts</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contract Text</Text>
          <TextInput
            style={styles.textInput}
            value={contractText}
            onChangeText={setContractText}
            placeholder="Paste your contract text here..."
            multiline
            numberOfLines={8}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.analyzeButton} 
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Analyzing...</Text>
            ) : (
              <Text style={styles.buttonText}>Analyze Contract</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {analysis ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Results</Text>
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{analysis}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>How It Works</Text>
            <Text style={styles.helpText}>
              1. Paste your contract text in the input field above\n
              2. Click "Analyze Contract" to get AI-powered insights\n
              3. Review the analysis for key clauses, risks, and recommendations
            </Text>
            
            <Text style={styles.helpTitle}>Tips for Better Analysis</Text>
            <Text style={styles.helpText}>
              • Include complete contract text for accurate analysis\n
              • Ensure text is clear and legible\n
              • Highlight specific areas of concern
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  analyzeButton: {
    flex: 0.7,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  clearButton: {
    flex: 0.3,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonText: {
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
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1e293b',
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

export default ContractAnalyzerScreen;