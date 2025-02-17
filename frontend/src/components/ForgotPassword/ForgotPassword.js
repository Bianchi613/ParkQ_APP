import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Navegação

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    // Lógica para enviar o e-mail de recuperação de senha
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', {
        email,
      });
      if (response.data.success) {
        setMessage('Instruções de recuperação foram enviadas para o seu e-mail.');
        setTimeout(() => {
          navigation.navigate('Login');  // Redireciona para a tela de login
        }, 3000);
      } else {
        setMessage('Erro ao enviar as instruções, tente novamente.');
      }
    } catch (error) {
      setMessage('Erro ao enviar as instruções, tente novamente.');
      console.error('Erro ao fazer a solicitação:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci a Senha</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          required
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Instruções</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
    color: '#333',
    fontSize: 16,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#676767',
    padding: 14,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    color: '#e74c3c',  // Cor para mensagens de erro
    textAlign: 'center',
  },
});

export default ForgotPassword;
