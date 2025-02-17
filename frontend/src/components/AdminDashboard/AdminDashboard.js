import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import Header from "../Layout/Header"; // Importando o Header

const AdminDashboard = () => {
  const [vagas, setVagas] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [estacionamento, setEstacionamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estacionamentoId, setEstacionamentoId] = useState(null); // Armazenando o id do estacionamento

  const navigation = useNavigation();

  useEffect(() => {
    // Buscar o ID do estacionamento do AsyncStorage
    const fetchEstacionamentoId = async () => {
      const id = await AsyncStorage.getItem("id_estacionamento");
      if (id) {
        setEstacionamentoId(id); // Atualizando o estado com o id do estacionamento
      } else {
        setError("❌ ID do estacionamento não encontrado. Faça login novamente.");
      }
    };

    fetchEstacionamentoId();
  }, []);

  useEffect(() => {
    if (!estacionamentoId) return; // Se não tiver ID, não faz as requisições

    console.log("📡 Buscando dados para o estacionamento ID:", estacionamentoId);

    // Buscar vagas
    axios
      .get(`http://localhost:3000/vagas?estacionamentoId=${estacionamentoId}`)
      .then((response) => {
        setVagas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erro ao buscar vagas.");
        console.error(error);
        setLoading(false);
      });

    // Buscar informações do estacionamento
    axios
      .get(`http://localhost:3000/estacionamentos/${estacionamentoId}`)
      .then((response) => {
        setEstacionamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar estacionamento:", error);
      });
  }, [estacionamentoId]);

  const gerarRelatorio = () => {
    if (!estacionamentoId) {
      setError("❌ Não é possível gerar o relatório sem um estacionamento associado.");
      return;
    }

    axios
      .get(`http://localhost:3000/estacionamentos/${estacionamentoId}/relatorio`)
      .then((response) => setRelatorio(response.data))
      .catch((error) => {
        setError("Erro ao gerar relatório.");
        console.error(error);
      });
  };

  // Função para liberar a vaga
  const liberarVaga = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3000/vagas/${id}/liberar`);
      // Atualiza a lista de vagas após liberar a vaga
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
    <View style={styles.adminDashboard}>
      <Header /> {/* Incluindo o Header aqui */}

      <View style={styles.dashboardHeader}>
        <Text style={styles.title}>Painel do Administrador</Text>
      </View>

      {/* Vagas na Parte Superior */}
      <View style={styles.vagasContainer}>
        <Text style={styles.sectionTitle}>Vagas</Text>
        {loading ? (
          <Text style={styles.loadingMessage}>Carregando vagas...</Text>
        ) : error ? (
          <Text style={styles.errorMessage}>{error}</Text>
        ) : (
          <ScrollView style={styles.vagasScroll} contentContainerStyle={styles.vagasContent}>
            {vagas.map((vaga) => (
              <View
                key={vaga.id}
                style={[styles.vagaCard, vaga.status && styles[vaga.status], vaga.reservada && styles.reservada]}
              >
                <Text style={styles.vagaNumero}>Vaga {vaga.numero}</Text>
                <Text style={styles.vagaTipo}>
                  {vaga.tipo === "carro" ? "🚗 Carro" : "🏍️ Moto"}
                </Text>
                <Text style={styles.vagaStatus}>
                  {vaga.reservada ? "✅ Reservada" : "❌ Disponível"}
                </Text>
                <TouchableOpacity
                  style={styles.liberarButton}
                  onPress={() => liberarVaga(vaga.id)}
                >
                  <Text style={styles.btnText}>Liberar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Informações do Estacionamento e Relatório no Meio */}
      <View style={styles.middleSection}>
        {estacionamento && (
          <View style={styles.estacionamentoInfo}>
            <Text style={styles.sectionTitle}>Informações do Estacionamento</Text>
            <View style={styles.infoCard}>
              <Text><strong>Nome:</strong> {estacionamento.nome}</Text>
              <Text><strong>Localização:</strong> {estacionamento.localizacao}</Text>
              <Text><strong>Capacidade Total:</strong> {estacionamento.capacidade} vagas</Text>
              <Text><strong>Vagas Disponíveis:</strong> {estacionamento.vagas_disponiveis}</Text>
            </View>
          </View>
        )}

        <View style={styles.relatorioContainer}>
          <Text style={styles.sectionTitle}>Relatório</Text>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          {relatorio && (
            <View style={styles.relatorioCard}>
              <Text><strong>Ocupação:</strong> {relatorio.ocupacao}%</Text>
              <Text><strong>Faturamento:</strong> R$ {relatorio.faturamento}</Text>
              <Text><strong>Tempo Médio:</strong> {relatorio.tempoMedio} min</Text>
            </View>
          )}
          <TouchableOpacity style={styles.gerarRelatorioButton} onPress={gerarRelatorio}>
            <Text style={styles.btnText}>Gerar Relatório</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões na Parte Inferior */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  adminDashboard: {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100%',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
  },
  vagasContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',  // Expandindo a largura para ocupar a tela
    maxWidth: 1200, // Max largura para dispositivos grandes
  },
  vagasScroll: {
    flexDirection: 'column',  // Mudando para coluna
    gap: 10,
    maxHeight: 300, // Definindo altura máxima
  },
  vagasContent: {
    alignItems: 'center', // Alinhando as vagas no centro
  },
  vagaCard: {
    flex: 0,
    padding: 40,
    borderRadius: 20,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#e9ecef',
    height: 150, // Ajustando altura para as vagas
    justifyContent: 'center',
    width: '100%', // Tornando as vagas mais largas
  },
  vagaNumero: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  vagaTipo: {
    fontSize: 9,
    color: '#555',
  },
  vagaStatus: {
    fontSize: 9
    ,
    color: '#555',
  },
  reservada: {
    backgroundColor: '#ffe3e3',
  },
  liberarButton: {
    backgroundColor: '#28a745',  // Cor verde para liberar
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#dc3545',
    textAlign: 'center',
  },
  middleSectioncd: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  estacionamentoInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  relatorioContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flex: 1,
  },
  relatorioCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  gerarRelatorioButton: {
    backgroundColor: '#030303',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#090909',
    color: 'white',
    borderRadius: 5,
    padding: 10,
  },
});

export default AdminDashboard;
