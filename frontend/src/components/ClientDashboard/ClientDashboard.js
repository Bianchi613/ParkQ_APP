import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Header from "../Layout/Header"; // Importando o Header

const ClientDashboard = () => {
  const [estacionamentos, setEstacionamentos] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Carregar estacionamentos ao iniciar o componente
    axios.get('http://localhost:3000/estacionamentos')
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
            {item.imagemUrl ? (
              <Image source={{ uri: item.imagemUrl }} style={styles.estacionamentoImage} />
            ) : (
              <View style={styles.defaultImage}><Text>Imagem indisponível</Text></View>
            )}

            {/* Informações do estacionamento */}
            <View style={styles.estacionamentoInfo}>
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
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#333333',
  },
  searchBar: {
    width: '75%',
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
  },
  estacionamentoItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    alignItems: 'center',
  },
  estacionamentoImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginRight: 20,
  },
  defaultImage: {
    width: 190,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  estacionamentoInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  estacionamentoName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estacionamentoLocation: {
    fontSize: 14,
    color: '#666666',
  },
  estacionamentoCapacity: {
    fontSize: 14,
    color: '#666666',
  },
  estacionamentoCategory: {
    fontSize: 14,
    color: '#666666',
  },
  reserveButton: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  noResultsText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ClientDashboard;
