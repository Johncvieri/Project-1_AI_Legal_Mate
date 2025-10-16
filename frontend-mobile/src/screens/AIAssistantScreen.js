import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const AIAssistantScreen = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your AI Legal Assistant. How can I help you with legal matters today?', sender: 'ai' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const { token } = useAuth();

  const handleSend = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      // In a real app, you would make an API call to your backend
      // const response = await api.post('/ai/ask', { question }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: `This is a simulated response to: "${question}". In a real application, this would be processed by our AI legal assistant using GPT-4 and legal databases.`,
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to get response from AI assistant');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Legal Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask any legal question</Text>
      </View>

      <ScrollView 
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer, 
              message.sender === 'user' ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === 'user' ? styles.userMessageText : styles.aiMessageText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
        
        {loading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <Text style={styles.aiMessageText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask a legal question..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={loading || !question.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#1e293b',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AIAssistantScreen;