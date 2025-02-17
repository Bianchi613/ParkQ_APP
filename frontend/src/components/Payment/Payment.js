import React, { useState } from 'react';
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const route = useRoute();
  const navigation = useNavigation();

  const { id_vaga, valor, id_usuario, plano_id, plano_descricao } = route.params || {};

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirm = async () => {
    if (!paymentMethod) {
      Alert.alert('Erro', 'Por favor, escolha uma forma de pagamento.');
      return;
    }

    try {
      // Criação da reserva
      const dataReserva = new Date().toISOString();
      const dataFim = null;

      const reservaResponse = await axios.post('http://localhost:3000/reservas', {
        id_vaga,
        id_usuario,
        valor,
        dataReserva,
        dataFim,
        plano_id,
      });

      const reservaId = reservaResponse.data.id;

      // Recuperando os detalhes da reserva
      const detalhesReservaResponse = await axios.get(`http://localhost:3000/reservas/${reservaId}`);
      const detalhesReserva = detalhesReservaResponse.data;

      // Registrando o pagamento
      const pagamentoResponse = await axios.post('http://localhost:3000/pagamentos', {
        id_reserva: reservaId,
        metodo_pagamento: paymentMethod,
        valor_pago: valor,
        data_hora: new Date().toISOString(),
      });

      // Reservando a vaga
      const reservaVagaResponse = await axios.post(`http://localhost:3000/vagas/${id_vaga}/reservar`);

      Alert.alert('Sucesso', 'Pagamento e reserva realizados com sucesso!');
      navigation.navigate('Success'); // Redirecionando para a página de sucesso
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      Alert.alert('Erro', 'Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleBack = async () => {
    if (id_vaga) {
      try {
        await axios.post(`http://localhost:3000/vagas/${id_vaga}/liberar`);
        Alert.alert('Sucesso', 'Vaga liberada com sucesso.');
      } catch (error) {
        console.error('Erro ao liberar a vaga:', error);
        Alert.alert('Erro', 'Erro ao liberar a vaga. Tente novamente.');
      }
    }

    navigation.goBack(); // Voltar para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha a forma de Pagamento:</Text>

      {/* Exibindo informações da reserva */}
      <View style={styles.reservationDetails}>
        <Text><strong>Vaga ID:</strong> {id_vaga}</Text>
        <Text><strong>Valor da Reserva:</strong> R$ {valor}</Text>
        <Text><strong>Plano Selecionado:</strong> {plano_descricao || 'Plano não selecionado'}</Text>
      </View>

      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => handlePaymentChange('PIX')}
        >
          <Text style={styles.paymentText}>Pagamento por PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => handlePaymentChange('Cartão de Crédito')}
        >
          <Text style={styles.paymentText}>Cartão de Crédito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => handlePaymentChange('Boleto Bancário')}
        >
          <Text style={styles.paymentText}>Boleto Bancário</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.buttonText}>Confirmar Pagamento</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.buttonText}>Cancelar e Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  reservationDetails: {
    marginBottom: 20,
  },
  paymentMethods: {
    marginBottom: 30,
  },
  paymentOption: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 18,
    color: '#333',
  },
  buttons: {
    marginTop: 20,
    width: '100%',
  },
  confirmButton: {
    padding: 12,
    backgroundColor: '#28a745',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Payment;
