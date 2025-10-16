import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';

const CommunityQnAScreen = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'What are the requirements for a valid contract in Indonesia?',
      author: 'John Doe',
      category: 'Contracts',
      votes: 12,
      answers: 5,
      date: '2023-10-15',
      content: 'I need to know what makes a contract legally binding in Indonesia.',
      answered: true,
    },
    {
      id: 2,
      title: 'How to register a small business in Jakarta?',
      author: 'Jane Smith',
      category: 'Business',
      votes: 8,
      answers: 3,
      date: '2023-10-14',
      content: 'What are the steps to legally register a small business?',
      answered: false,
    },
    {
      id: 3,
      title: 'Property transfer process?',
      author: 'Robert Johnson',
      category: 'Property',
      votes: 5,
      answers: 2,
      date: '2023-10-13',
      content: 'Looking for information on property transfer procedures.',
      answered: true,
    },
  ]);
  
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'General',
  });
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'contracts', name: 'Contracts' },
    { id: 'business', name: 'Business' },
    { id: 'property', name: 'Property' },
    { id: 'family', name: 'Family' },
    { id: 'criminal', name: 'Criminal' },
    { id: 'general', name: 'General' },
  ];

  const handleAskQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const questionToAdd = {
      id: Date.now(),
      title: newQuestion.title,
      content: newQuestion.content,
      author: 'Current User', // This would come from auth context
      category: newQuestion.category,
      votes: 0,
      answers: 0,
      date: new Date().toISOString().split('T')[0],
      answered: false,
    };

    setQuestions([questionToAdd, ...questions]);
    setNewQuestion({ title: '', content: '', category: 'General' });
    setShowForm(false);
  };

  const renderQuestionItem = ({ item }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionCategory}>{item.category}</Text>
        <Text style={styles.questionDate}>{item.date}</Text>
      </View>
      
      <Text style={styles.questionTitle}>{item.title}</Text>
      <Text style={styles.questionContent}>{item.content}</Text>
      
      <View style={styles.questionFooter}>
        <Text style={styles.questionAuthor}>By {item.author}</Text>
        <View style={styles.questionStats}>
          <Text style={styles.statText}>{item.votes} votes</Text>
          <Text style={styles.statText}>{item.answers} answers</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Q&A</Text>
        <Text style={styles.headerSubtitle}>Ask and answer legal questions</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.askButton} 
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.askButtonText}>+ Ask a Question</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Ask a Question</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Question title"
            value={newQuestion.title}
            onChangeText={(text) => setNewQuestion({...newQuestion, title: text})}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Question details..."
            value={newQuestion.content}
            onChangeText={(text) => setNewQuestion({...newQuestion, content: text})}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.picker}>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewQuestion({...newQuestion, category: 'General'})}
            >
              <Text style={newQuestion.category === 'General' ? styles.pickerItemSelected : styles.pickerItemText}>
                General
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewQuestion({...newQuestion, category: 'Contracts'})}
            >
              <Text style={newQuestion.category === 'Contracts' ? styles.pickerItemSelected : styles.pickerItemText}>
                Contracts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pickerItem} 
              onPress={() => setNewQuestion({...newQuestion, category: 'Business'})}
            >
              <Text style={newQuestion.category === 'Business' ? styles.pickerItemSelected : styles.pickerItemText}>
                Business
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAskQuestion}>
              <Text style={styles.submitButtonText}>Submit Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.questionsList}
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
  askButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  askButtonText: {
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
    height: 100,
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
  submitButton: {
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
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  questionsList: {
    padding: 20,
  },
  questionCard: {
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  questionContent: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  questionAuthor: {
    fontSize: 12,
    color: '#94a3b8',
  },
  questionStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default CommunityQnAScreen;