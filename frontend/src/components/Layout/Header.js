import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Limpar dados armazenados no AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('id_estacionamento');
      
      // Redirecionar para a tela de login após logout
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao deslogar. Tente novamente.');
      console.error(error);
    }
  };

  const handleProfile = async () => {
    try {
      // Acessa o userId do AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        navigation.navigate('Profile', { userId }); // Redireciona para o perfil
      } else {
        Alert.alert('Erro', 'ID do usuário não encontrado!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao acessar o perfil. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title} onPress={() => navigation.navigate('Home')}>Park Q</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#fefefe',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    boxShadow: '0 4px 10px rgba(114, 114, 114, 0.1)', // A sombra não é diretamente suportada, mas podemos simular com outras abordagens
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  profileButton: {
    backgroundColor: '#282828',
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#e7796d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Header;
