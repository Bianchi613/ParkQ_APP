import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost:3000"; // Definição do IP do backend

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
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.error('ID do usuário não encontrado.');
          navigation.navigate('Login');
          return;
        }

        const { data } = await axios.get(`${BASE_URL}/usuarios/${userId}`);
        setUserData(data);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        setError('Erro ao carregar os dados do usuário. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleChange = (name, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(`${BASE_URL}/usuarios/${userId}`, userData);
      Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
      setEditing(false);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setError('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações do Perfil</Text>

      {error && <Text style={styles.errorMessage}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}

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
      <View style={styles.switchGroup}>
        <Text>Notificações</Text>
        <Switch
          value={userData.notificacoes}
          onValueChange={() => handleChange('notificacoes', !userData.notificacoes)}
          disabled={!editing || loading}
        />
      </View>

      <View style={styles.buttonGroup}>
        {!editing ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)} disabled={loading}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonGroup: {
    marginTop: 15,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#343a40',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: '50%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: '50%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loading: {
    marginBottom: 15,
  },
});

export default ProfileSettings;
