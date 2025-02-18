import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileSettings = ({ navigation }) => {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    CPF: '',
    idioma: 'Português',
    notificacoes: false,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId'); // Obtendo userId de forma assíncrona
      if (!userId) {
        console.error('ID do usuário não encontrado.');
        navigation.navigate('Login'); 
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3000/usuarios/${userId}`);
        setUserData(data);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        setError('Erro ao carregar os dados do usuário. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // Chama a função assíncrona
  }, [navigation]); // Dependência de navigation para o caso de redirecionamento

  const handleChange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleToggleNotifications = () => {
    setUserData({
      ...userData,
      notificacoes: !userData.notificacoes,
    });
  };

  const validateFields = () => {
    const { nome, email, telefone, CPF } = userData;

    if (!nome || !email || !telefone || !CPF) {
      setError('Todos os campos são obrigatórios.');
      return false;
    }

    if (!/^\d{11}$/.test(CPF)) {
      setError('CPF inválido. Deve conter 11 dígitos.');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email inválido.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId'); // Garantir que userId é obtido para o PUT
      await axios.put(`http://localhost:3000/usuarios/${userId}`, userData);
      Alert.alert('Alterações salvas com sucesso!');
      setEditing(false); 
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setError('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações do Perfil</Text>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

      <View style={styles.inputGroup}>
        <Text>Nome</Text>
        <TextInput
          style={styles.input}
          value={userData.nome}
          onChangeText={(text) => handleChange('nome', text)}
          editable={editing && !loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) => handleChange('email', text)}
          editable={editing && !loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Telefone</Text>
        <TextInput
          style={styles.input}
          value={userData.telefone}
          onChangeText={(text) => handleChange('telefone', text)}
          editable={editing && !loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>CPF</Text>
        <TextInput
          style={styles.input}
          value={userData.CPF}
          onChangeText={(text) => handleChange('CPF', text)}
          editable={editing && !loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Idioma</Text>
        <TextInput
          style={styles.input}
          value={userData.idioma}
          onChangeText={(text) => handleChange('idioma', text)}
          editable={editing && !loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Notificações</Text>
        <Switch
          value={userData.notificacoes}
          onValueChange={handleToggleNotifications}
          disabled={!editing || loading}
        />
      </View>

      <View style={styles.buttonGroup}>
        {!editing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 20,
    alignItems: 'center', // Centraliza os botões horizontalmente
  },
  editButton: {
    backgroundColor: '#343535',
    paddingVertical: 8,  // Mantém a altura do botão
    paddingHorizontal: 15, // Mantém o espaço horizontal dentro do botão
    borderRadius: 8,
    marginBottom: 10,
    width: '30%',  // Define a largura do botão (60% da largura disponível)
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '30%', // Define a largura do botão
  },
  backButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '30%',  // Define a largura do botão
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Diminui o tamanho da fonte do botão
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ProfileSettings;
