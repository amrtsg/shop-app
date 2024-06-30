import React, { useRef, useEffect, useState, } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { getOpenAIResponse } from '@/js/openai';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';

export default function ContactUs() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const assistantResponse = await getOpenAIResponse(input);
    const assistantMessage = { role: 'assistant', content: assistantResponse };

    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    setInput('');
    // Scroll to the bottom after sending a message
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    // Scroll to the bottom when the component mounts to show the initial message
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Assistant</Text>
      </View>
      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollViewRef}>
          {messages.map((msg, index) => (
            <View key={index} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor={Colors.inputPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icons.MaterialCommunityIcons name='send-circle' color={Colors.textlight} size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  logo: {
    width: 150,
    height: 50,
  },
  headerText: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: Colors.textlight,
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.transdark5,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textlight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.translight1,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.translight05,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 150,
    color: Colors.textlight
  },
  sendButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
