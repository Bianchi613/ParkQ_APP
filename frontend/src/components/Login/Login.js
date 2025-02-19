import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Definindo a URL base do backend usando variáveis de ambiente
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: formData.email,
        senha: formData.senha,
      });

      const { role, access_token: token, id: userId } = response.data;

      if (role && token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId.toString());

        if (role === 'ADMIN') {
          navigation.navigate('AdminDashboard');
        } else if (role === 'CLIENT') {
          navigation.navigate('ClientDashboard');
        } else {
          setError('Perfil inválido');
        }
      } else {
        setError('Erro ao fazer login: dados inválidos');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      setError('Erro ao fazer login. Tente novamente!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Park Q</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={formData.senha}
          onChangeText={(value) => handleChange('senha', value)}
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    backgroundColor: '#fff',
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
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  btn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 10,
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#6b6969',
    textDecorationLine: 'underline',
  },
});

export default Login;