import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../Layout/Header"; // Importando o Header

const BASE_URL = "http://localhost:3000"; // IP do backend na rede local

const TariffPlan = () => {
  const [planos, setPlanos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [dataVigencia, setDataVigencia] = useState('');
  const [taxaBase, setTaxaBase] = useState('');
  const [taxaHora, setTaxaHora] = useState('');
  const [taxaDiaria, setTaxaDiaria] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/planos-tarifacao`);
      setPlanos(response.data);
    } catch (error) {
      setError("Erro ao buscar planos de tarifação.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (parseFloat(taxaBase) < 0 || parseFloat(taxaHora) < 0 || parseFloat(taxaDiaria) < 0) {
      setError("As taxas devem ser valores positivos.");
      return;
    }

    const dataFormatada = new Date(dataVigencia).toLocaleDateString('en-CA');

    if (new Date(dataFormatada) < new Date()) {
      setError("A data de vigência não pode ser uma data passada.");
      return;
    }

    const novoPlano = {
      descricao,
      data_vigencia: dataFormatada,
      taxa_base: parseFloat(taxaBase),
      taxa_hora: parseFloat(taxaHora),
      taxa_diaria: parseFloat(taxaDiaria),
    };

    try {
      if (editingPlan) {
        await axios.patch(`${BASE_URL}/planos-tarifacao/${editingPlan.id}`, novoPlano);
        setSuccess("Plano atualizado com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/planos-tarifacao`, novoPlano);
        setSuccess("Plano criado com sucesso!");
      }
      fetchPlanos();
      resetForm();
      setError(null);
    } catch (error) {
      setError("Erro ao salvar plano de tarifação.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/planos-tarifacao/${id}`);
      setSuccess("Plano excluído com sucesso!");
      fetchPlanos();
    } catch (error) {
      setError("Erro ao excluir plano de tarifação.");
      console.error(error);
    }
  };

  const handleEdit = (plano) => {
    setEditingPlan(plano);
    setDescricao(plano.descricao);
    setDataVigencia(plano.data_vigencia.split("T")[0]);
    setTaxaBase(plano.taxa_base);
    setTaxaHora(plano.taxa_hora);
    setTaxaDiaria(plano.taxa_diaria);
  };

  const resetForm = () => {
    setDescricao('');
    setDataVigencia('');
    setTaxaBase('');
    setTaxaHora('');
    setTaxaDiaria('');
    setEditingPlan(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header /> {/* Incluindo o Header aqui */}
      <Text style={styles.header}>Planos de Tarifação</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Vigência"
          value={dataVigencia}
          onChangeText={setDataVigencia}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Taxa Base"
          value={taxaBase}
          onChangeText={setTaxaBase}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Taxa Hora"
          value={taxaHora}
          onChangeText={setTaxaHora}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Taxa Diária"
          value={taxaDiaria}
          onChangeText={setTaxaDiaria}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingPlan ? 'Atualizar Plano' : 'Criar Plano'}</Text>
        </TouchableOpacity>
      </View>

      {/* Exibindo os planos de tarifação de forma horizontal com rolagem */}
      <ScrollView horizontal={true} style={styles.planList}>
        {planos.map(plano => (
          <View key={plano.id} style={styles.planItem}>
            <Text style={styles.planDescription}>{plano.descricao}</Text>
            <Text style={styles.planDetails}>Vigência: {plano.data_vigencia.split("T")[0]}</Text>
            <Text style={styles.planDetails}>Taxa Base: R$ {plano.taxa_base}</Text>
            <Text style={styles.planDetails}>Taxa Hora: R$ {plano.taxa_hora}</Text>
            <Text style={styles.planDetails}>Taxa Diária: R$ {plano.taxa_diaria}</Text>

            <View style={styles.planActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(plano)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(plano.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  planList: {
    marginTop: 20,
  },
  planItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginRight: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  planDescription: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  planDetails: {
    fontSize: 14,
    color: '#666',
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
  },
  backButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default TariffPlan;