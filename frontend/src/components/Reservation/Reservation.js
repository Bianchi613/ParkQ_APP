import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const Reservation = () => {
  const [vagas, setVagas] = useState([]);
  const [estacionamento, setEstacionamento] = useState(null);
  const [planosTarifacao, setPlanosTarifacao] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState({ id: null, taxa_base: 0 });
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params;

  useEffect(() => {
    // Buscar informações do estacionamento
    axios.get(`http://localhost:3000/estacionamentos/${id}`)
      .then(response => setEstacionamento(response.data))
      .catch(error => console.error('Erro ao carregar o estacionamento:', error));

    // Buscar vagas
    axios.get(`http://localhost:3000/vagas?id_estacionamento=${id}`)
      .then(response => setVagas(response.data))
      .catch(error => console.error('Erro ao carregar as vagas:', error));

    // Buscar planos de tarifação
    axios.get('http://localhost:3000/planos-tarifacao')
      .then(response => setPlanosTarifacao(response.data))
      .catch(error => console.error('Erro ao carregar os planos de tarifação:', error));
  }, [id]);

  const handleConfirm = (vaga) => {
    // Substituindo localStorage por AsyncStorage para pegar o userId
    AsyncStorage.getItem('userId')
      .then((userId) => {
        if (!userId) {
          Alert.alert('Erro', 'Usuário não autenticado. Faça login para continuar.');
          navigation.navigate('Login');
          return;
        }

        if (vaga.status === 'disponivel' && planoSelecionado.id) {
          navigation.navigate('Payment', {
            id_vaga: vaga.id,
            id_usuario: userId,
            valor: planoSelecionado.taxa_base,
            plano_id: planoSelecionado.id,
          });
        } else if (!planoSelecionado.id) {
          Alert.alert('Erro', 'Por favor, selecione um plano de tarifação.');
        } else {
          Alert.alert('Erro', 'Esta vaga não está disponível para reserva.');
        }
      })
      .catch((error) => {
        console.error('Erro ao obter userId do AsyncStorage:', error);
      });
  };

  const renderVaga = ({ item }) => (
    <View style={styles.vagaItem}>
      <Text style={styles.vagaNumero}>{`Vaga ${item.numero}`}</Text>
      <Text style={styles.vagaStatus}>{item.status === 'disponivel' ? 'Disponível' : 'Indisponível'}</Text>
      <Button
        title={item.status === 'disponivel' ? 'Confirmar Reserva' : 'Indisponível'}
        onPress={() => handleConfirm(item)}
        disabled={item.status !== 'disponivel'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar uma vaga</Text>

      {/* Removido o Mapa, já que não estamos mais utilizando o react-native-maps */}
      <View style={styles.planosContainer}>
        <Text style={styles.subTitle}>Selecione um plano de tarifação:</Text>
        <FlatList
          data={planosTarifacao}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.planButton}
              onPress={() => setPlanoSelecionado(item)}
            >
              <Text style={styles.planText}>{item.descricao} - R$ {item.taxa_base}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVaga}
      />

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: '#333',
  },
  planosContainer: {
    width: '100%',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  planButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
  },
  planText: {
    fontSize: 16,
    color: '#333',
  },
  vagaItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  vagaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vagaStatus: {
    fontSize: 16,
    color: '#666',
  },
});

export default Reservation;
