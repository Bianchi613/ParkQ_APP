import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../Layout/Header";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adicione ícones para melhorar a visualização

const BASE_URL = "http://localhost:3000"; // IP do backend na rede local

const { width } = Dimensions.get('window'); // Para ajustar o layout responsivo

const AdminDashboard = () => {
  const [vagas, setVagas] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [estacionamento, setEstacionamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estacionamentoId, setEstacionamentoId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/usuarios/${userId}`);
          const userData = response.data;

          if (userData.id_estacionamento) {
            setEstacionamentoId(userData.id_estacionamento);
          } else {
            setError("❌ Não há estacionamento associado ao usuário.");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário:", error);
          setError("Erro ao obter dados do usuário.");
        }
      } else {
        setError("❌ Usuário não autenticado. Faça login novamente.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!estacionamentoId) return;

    axios
      .get(`${BASE_URL}/vagas?estacionamentoId=${estacionamentoId}`)
      .then((response) => {
        setVagas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erro ao buscar vagas.");
        console.error(error);
        setLoading(false);
      });

    axios
      .get(`${BASE_URL}/estacionamentos/${estacionamentoId}`)
      .then((response) => {
        setEstacionamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar estacionamento:", error);
        setError("Erro ao buscar informações do estacionamento.");
      });
  }, [estacionamentoId]);

  const gerarRelatorio = () => {
    if (!estacionamentoId) {
      setError("❌ Não é possível gerar o relatório sem um estacionamento associado.");
      return;
    }

    axios
      .get(`${BASE_URL}/estacionamentos/${estacionamentoId}/relatorio`)
      .then((response) => setRelatorio(response.data))
      .catch((error) => {
        setError("Erro ao gerar relatório.");
        console.error(error);
      });
  };

  // Função para liberar a vaga
  const liberarVaga = async (id) => {
    try {
      const response = await axios.post(`${BASE_URL}/vagas/${id}/liberar`);
      setVagas((prevVagas) =>
        prevVagas.map((vaga) =>
          vaga.id === id ? { ...vaga, status: "disponivel", reservada: false } : vaga
        )
      );
      console.log("Vaga liberada com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao liberar vaga:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 100 }} // Garante espaço para os botões visíveis
      >
        <View style={styles.dashboardHeader}>
          <Text style={styles.title}>Painel do Administrador</Text>
        </View>

        <View style={styles.vagasContainer}>
          <Text style={styles.sectionTitle}>Vagas</Text>
          {loading ? (
            <Text style={styles.loadingMessage}>Carregando vagas...</Text>
          ) : error ? (
            <Text style={styles.errorMessage}>{error}</Text>
          ) : (
            <View style={styles.vagasGrid}>
              {vagas.map((vaga) => (
                <View key={vaga.id} style={[styles.vagaCard, vaga.reservada ? styles.reservada : styles.disponivel]}>
                  <Icon 
                    name={vaga.tipo === "carro" ? "directions-car" : "motorcycle"} 
                    size={30} 
                    color={vaga.reservada ? "#fff" : "#333"} 
                  />
                  <Text style={[styles.vagaNumero, vaga.reservada && styles.textWhite]}>Vaga {vaga.numero}</Text>
                  <Text style={[styles.vagaStatus, vaga.reservada && styles.textWhite]}>
                    {vaga.reservada ? "Reservada" : "Disponível"}
                  </Text>
                  {/* Botão de liberar vaga */}
                  {vaga.reservada && (
                    <TouchableOpacity
                      style={styles.liberarButton}
                      onPress={() => liberarVaga(vaga.id)}
                    >
                      <Text style={styles.btnText}>Liberar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {estacionamento && (
          <View style={styles.estacionamentoInfo}>
            <Text style={styles.sectionTitle}>Informações do Estacionamento</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nome: </Text>
                {estacionamento.nome}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Localização: </Text>
                {estacionamento.localizacao}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Capacidade Total: </Text>
                {estacionamento.capacidade} vagas
              </Text>
            </View>
          </View>
        )}

        <View style={styles.relatorioContainer}>
          <Text style={styles.sectionTitle}>Relatório</Text>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          {relatorio && (
            <View style={styles.relatorioCard}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Ocupação: </Text>
                {relatorio.ocupacao}%
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Faturamento: </Text>
                R$ {relatorio.faturamento}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Tempo Médio: </Text>
                {relatorio.tempoMedio} min
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.gerarRelatorioButton} onPress={gerarRelatorio}>
            <Text style={styles.btnText}>Gerar Relatório</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 BOTÕES NO FINAL DA TELA */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("ParkingManagement")}
          >
            <Text style={styles.btnText}>Cadastrar Estacionamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("TariffPlan")}
          >
            <Text style={styles.btnText}>Plano de Tarifação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  dashboardHeader: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  buttonsContainer: { flexDirection: 'row', gap: 12, marginTop: 20, paddingHorizontal: 16 },
  navButton: { flex: 1, backgroundColor: '#000', borderRadius: 8, padding: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16 },
  relatorioContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  gerarRelatorioButton: { backgroundColor: '#000', borderRadius: 8, padding: 12, alignItems: 'center' },
  vagasContainer: { marginBottom: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  vagasGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  vagaCard: {
    width: width * 0.45, // 45% da largura da tela
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservada: { backgroundColor: '#ff4444' }, // Vermelho para vagas reservadas
  disponivel: { backgroundColor: '#fff' }, // Branco para vagas disponíveis
  vagaNumero: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  vagaStatus: { fontSize: 14, color: '#666', marginTop: 4 },
  textWhite: { color: '#fff' }, // Texto branco para vagas reservadas
  loadingMessage: { fontSize: 16, color: '#666', textAlign: 'center' },
  errorMessage: { fontSize: 16, color: '#ff4444', textAlign: 'center' },
  estacionamentoInfo: { marginBottom: 20, paddingHorizontal: 16 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  infoText: { fontSize: 16, color: '#333', marginBottom: 8 },
  infoLabel: { fontWeight: 'bold' },
  relatorioCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  liberarButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminDashboard;
