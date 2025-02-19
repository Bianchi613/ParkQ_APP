import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

// Definindo a URL base do backend usando variáveis de ambiente
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Reservation = () => {
  const [vagas, setVagas] = useState([]);
  const [planosTarifacao, setPlanosTarifacao] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState({ id: null, taxa_base: 0 });
  const [isPlanosVisible, setIsPlanosVisible] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params;

  useEffect(() => {
    axios.get(`${BASE_URL}/estacionamentos/${id}`)
      .then(response => setEstacionamento(response.data))
      .catch(error => console.error('Erro ao carregar o estacionamento:', error));

    axios.get(`${BASE_URL}/vagas?id_estacionamento=${id}`)
      .then(response => setVagas(response.data))
      .catch(error => console.error('Erro ao carregar as vagas:', error));

    axios.get(`${BASE_URL}/planos-tarifacao`)
      .then(response => setPlanosTarifacao(response.data))
      .catch(error => console.error('Erro ao carregar os planos de tarifação:', error));
  }, [id]);

  const handleConfirm = (vaga) => {
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

  const renderVaga = (vaga) => (
    <View style={styles.vagaItem} key={vaga.id}>
      <Text style={styles.vagaNumero}>{`Vaga ${vaga.numero}`}</Text>
      <Text style={styles.vagaStatus}>{vaga.status === 'disponivel' ? 'Disponível' : 'Indisponível'}</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleConfirm(vaga)}
        disabled={vaga.status !== 'disponivel'}
      >
        <Text style={styles.buttonText}>{vaga.status === 'disponivel' ? 'Confirmar Reserva' : 'Indisponível'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar uma vaga</Text>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsPlanosVisible(!isPlanosVisible)}
      >
        <Text style={styles.toggleButtonText}>{isPlanosVisible ? 'Esconder Planos' : 'Mostrar Planos'}</Text>
      </TouchableOpacity>

      {isPlanosVisible && (
        <View style={styles.planosContainer}>
          <Text style={styles.subTitle}>Selecione um plano de tarifação:</Text>
          {planosTarifacao.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.planButton, planoSelecionado.id === item.id && styles.selectedPlanButton]}
              onPress={() => setPlanoSelecionado(item)}
            >
              <Text style={styles.planText}>
                {item.descricao} - R$ {item.taxa_base}
                {planoSelecionado.id === item.id && ' (Selecionado)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.vagasContainer}>
        <View style={styles.vagasList}>
          {vagas.map((vaga) => renderVaga(vaga))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  planButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPlanButton: {
    backgroundColor: '#dcdcdc',
  },
  vagasContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  vagasList: {
    flexDirection: 'column',
  },
  vagaItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
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
  actionButton: {
    backgroundColor: '#000',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: '50%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default Reservation;
