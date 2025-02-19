import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Header from "../Layout/Header"; // Importando o Header

// Definindo a URL base do backend usando variáveis de ambiente
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ClientDashboard = () => {
  const [estacionamentos, setEstacionamentos] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Carregar estacionamentos ao iniciar o componente
    axios.get(`${BASE_URL}/estacionamentos`)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setEstacionamentos(data);
        } else {
          setErrorMessage('Dados de estacionamentos inválidos.');
        }
      })
      .catch(error => {
        setErrorMessage('Erro ao carregar estacionamentos. Tente novamente mais tarde.');
        console.error('Erro ao carregar estacionamentos:', error);
      });
  }, []);

  // Filtrar estacionamentos com base no termo de busca
  const filteredEstacionamentos = estacionamentos.filter(estacionamento =>
    estacionamento.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estacionamento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para navegação à página de reserva
  const handleReserva = (estacionamentoId) => {
    navigation.navigate('Reservation', { estacionamentoId });
  };

  return (
    <View style={styles.container}>
      <Header /> {/* Incluindo o Header aqui */}
      <Text style={styles.title}>Vagas Próximas</Text>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      
      <TextInput
        style={styles.searchBar}
        placeholder="Digite o Local da Vaga"
        value={searchTerm}
        onChangeText={setSearchTerm} // Atualiza o termo de busca
      />
      
      <FlatList
        data={filteredEstacionamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.estacionamentoItem}>
            {/* Imagem do estacionamento */}
            <View style={styles.imageContainer}>
              {item.imagemUrl ? (
                <Image source={{ uri: item.imagemUrl }} style={styles.estacionamentoImage} />
              ) : (
                <View style={styles.defaultImage}>
                  <Text style={styles.defaultImageText}>Imagem indisponível</Text>
                </View>
              )}
            </View>

            {/* Informações do estacionamento */}
            <View style={styles.infoContainer}>
              <Text style={styles.estacionamentoName}>{item.nome}</Text>
              <Text style={styles.estacionamentoLocation}>{item.localizacao}</Text>
              <Text style={styles.estacionamentoCapacity}>{item.capacidade} vagas disponíveis</Text>
              <Text style={styles.estacionamentoCategory}>Categoria: {item.categoria}</Text>
            </View>

            {/* Botão de reserva */}
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => handleReserva(item.id)}
            >
              <Text style={styles.reserveButtonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResultsText}>Nenhum estacionamento encontrado para a busca.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  searchBar: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    color: '#333333',
    fontSize: 16,
  },
  errorMessage: {
    color: '#ff4d4d',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  estacionamentoItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  estacionamentoImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  defaultImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImageText: {
    color: '#666666',
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 15,
  },
  estacionamentoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  estacionamentoLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  estacionamentoCapacity: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  estacionamentoCategory: {
    fontSize: 14,
    color: '#666666',
  },
  reserveButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClientDashboard;