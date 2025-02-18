import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    CPF: '',
    login: '',
    isAdmin: false,
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

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }

    if (!formData.CPF) {
      setError('O CPF é obrigatório.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuarios', {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        CPF: formData.CPF,
        login: formData.login,
        role: formData.isAdmin ? 'ADMIN' : 'CLIENT',
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={formData.nome}
        onChangeText={(value) => handleChange('nome', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={formData.telefone}
        onChangeText={(value) => handleChange('telefone', value)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={formData.CPF}
        onChangeText={(value) => handleChange('CPF', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Login"
        value={formData.login}
        onChangeText={(value) => handleChange('login', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={formData.senha}
        onChangeText={(value) => handleChange('senha', value)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={formData.confirmarSenha}
        onChangeText={(value) => handleChange('confirmarSenha', value)}
        secureTextEntry
      />

      <View style={styles.adminToggle}>
        <Text>Tipo de Perfil</Text>
        <TouchableOpacity onPress={() => handleChange('isAdmin', !formData.isAdmin)}>
          <Text style={styles.toggleText}>{formData.isAdmin ? 'Administrador' : 'Cliente'}</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '75%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    width: '20%',
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  adminToggle: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#6b6969',
    marginTop: 5,
    fontSize: 16,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Register;
