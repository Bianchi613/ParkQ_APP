import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

// Definindo a URL base do backend usando variáveis de ambiente
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
      const dataReserva = new Date().toISOString();
      const dataFim = null;

      // Criar reserva
      const reservaResponse = await axios.post(`${BASE_URL}/reservas`, {
        id_vaga,
        id_usuario,
        valor,
        dataReserva,
        dataFim,
        plano_id,
      });

      const reservaId = reservaResponse.data.id;

      // Realizar pagamento
      await axios.post(`${BASE_URL}/pagamentos`, {
        id_reserva: reservaId,
        metodo_pagamento: paymentMethod,
        valor_pago: valor,
        data_hora: new Date().toISOString(),
      });

      // Marcar vaga como reservada
      await axios.post(`${BASE_URL}/vagas/${id_vaga}/reservar`);

      Alert.alert('Sucesso', 'Pagamento e reserva realizados com sucesso!');
      navigation.navigate('Success');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      Alert.alert('Erro', 'Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleBack = async () => {
    if (id_vaga) {
      try {
        await axios.post(`${BASE_URL}/vagas/${id_vaga}/liberar`);
        Alert.alert('Sucesso', 'Vaga liberada com sucesso.');
      } catch (error) {
        console.error('Erro ao liberar a vaga:', error);
        Alert.alert('Erro', 'Erro ao liberar a vaga. Tente novamente.');
      }
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Escolha a forma de Pagamento:</Text>

      {/* Exibindo informações da reserva */}
      <View style={styles.reservationDetails}>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>Vaga ID:</Text> {id_vaga}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>Valor da Reserva:</Text> R$ {valor}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>Plano Selecionado:</Text> {plano_descricao || 'Plano não selecionado'}</Text>
      </View>

      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'PIX' && styles.selectedPayment]}
          onPress={() => handlePaymentChange('PIX')}
        >
          <Text style={styles.paymentText}>Pagamento por PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'Cartão de Crédito' && styles.selectedPayment]}
          onPress={() => handlePaymentChange('Cartão de Crédito')}
        >
          <Text style={styles.paymentText}>Cartão de Crédito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'Boleto Bancário' && styles.selectedPayment]}
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
    </ScrollView>
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
    color: '#333',
  },
  reservationDetails: {
    marginBottom: 20,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  paymentMethods: {
    marginBottom: 30,
    width: '30%',
  },
  paymentOption: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPayment: {
    backgroundColor: '#000',
    borderColor: '#333',
  },
  paymentText: {
    fontSize: 18,
    color: '#333',
  },
  buttons: {
    marginTop: 20,
    width: '50%',
  },
  confirmButton: {
    padding: 25,
    backgroundColor: '#000',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    padding: 25,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Payment;
