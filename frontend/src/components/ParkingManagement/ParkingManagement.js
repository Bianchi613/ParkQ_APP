import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../Layout/Header";

const ParkingManagement = () => {
  const navigate = useNavigation();
  const [parkings, setParkings] = useState([]);
  const [spots, setSpots] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showParkingForm, setShowParkingForm] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [currentParking, setCurrentParking] = useState({});
  const [currentSpot, setCurrentSpot] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParkings();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      fetchSpots(selectedParking.id);
    }
  }, [selectedParking]);

  const fetchParkings = async () => {
    try {
      const response = await fetch("http://localhost:3000/estacionamentos");
      const data = await response.json();
      setParkings(data);
    } catch (error) {
      setError("Erro ao buscar estacionamentos");
    }
  };

  const fetchSpots = async (parkingId) => {
    try {
      const response = await fetch(`http://localhost:3000/vagas?id_estacionamento=${parkingId}`);
      const data = await response.json();
      setSpots(data);
    } catch (error) {
      setError("Erro ao buscar vagas");
    }
  };

  const handleSaveParking = async (parking) => {
    const url = parking.id
      ? `http://localhost:3000/estacionamentos/${parking.id}`
      : "http://localhost:3000/estacionamentos";
    const method = parking.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parking),
      });
      if (response.ok) {
        fetchParkings();
        setShowParkingForm(false);
        setCurrentParking({});
      }
    } catch (error) {
      setError("Erro ao salvar estacionamento");
    }
  };

  const handleSaveSpot = async (spot) => {
    const url = spot.id ? `http://localhost:3000/vagas/${spot.id}` : "http://localhost:3000/vagas";
    const method = spot.id ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...spot, id_estacionamento: selectedParking.id }),
      });
      if (response.ok) {
        fetchSpots(selectedParking.id);
        setShowSpotForm(false);
        setCurrentSpot({});
      }
    } catch (error) {
      setError("Erro ao salvar vaga");
    }
  };

  const handleDeleteParking = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/estacionamentos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchParkings();
      }
    } catch (error) {
      setError("Erro ao excluir estacionamento");
    }
  };

  const handleDeleteSpot = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/vagas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSpots(selectedParking.id);
      }
    } catch (error) {
      setError("Erro ao excluir vaga");
    }
  };

  const saveEstacionamentoId = async (id) => {
    try {
      await AsyncStorage.setItem('id_estacionamento', id.toString());
    } catch (error) {
      console.error('Erro ao salvar o ID do estacionamento:', error);
    }
  };

  return (
    <View style={styles.parkingManagement}>
      <Header />
      <Text style={styles.header}>Gerenciamento de Estacionamentos e Vagas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigate("/admin-dashboard")}>
        <Text style={styles.buttonText}>Voltar ao Admin Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.parkingSection}>
        <Text style={styles.subHeader}>Estacionamentos</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { setShowParkingForm(true); setCurrentParking({}); }}
        >
          <Text style={styles.buttonText}>Adicionar Estacionamento</Text>
        </TouchableOpacity>

        <FlatList
          data={parkings}
          renderItem={({ item }) => (
            <View style={styles.parkingItem}>
              <Text style={styles.parkingItemText}>{item.nome}</Text>
              <Text style={styles.parkingItemText}>{item.localizacao}</Text>
              <Text style={styles.parkingItemText}>{item.capacidade}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setCurrentParking(item);
                    setShowParkingForm(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteParking(item.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setSelectedParking(item)}
                >
                  <Text style={styles.buttonText}>Ver Vagas</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {selectedParking && (
        <View style={styles.spotSection}>
          <Text style={styles.subHeader}>Vagas do Estacionamento: {selectedParking.nome}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { setShowSpotForm(true); setCurrentSpot({}); }}
          >
            <Text style={styles.buttonText}>Adicionar Vaga</Text>
          </TouchableOpacity>

          <FlatList
            data={spots}
            renderItem={({ item }) => (
              <View style={styles.spotItem}>
                <Text style={styles.spotItemText}>{item.numero}</Text>
                <Text style={styles.spotItemText}>{item.status}</Text>
                <Text style={styles.spotItemText}>{item.tipo}</Text>
                <Text style={styles.spotItemText}>{item.reservada ? "Sim" : "Não"}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setCurrentSpot(item);
                      setShowSpotForm(true);
                    }}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteSpot(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}

      <Modal visible={showParkingForm} onRequestClose={() => setShowParkingForm(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{currentParking.id ? "Editar Estacionamento" : "Adicionar Estacionamento"}</Text>
          <TextInput
            style={styles.input}
            value={currentParking.nome || ""}
            onChangeText={(text) => setCurrentParking({ ...currentParking, nome: text })}
            placeholder="Nome do Estacionamento"
          />
          <TextInput
            style={styles.input}
            value={currentParking.localizacao || ""}
            onChangeText={(text) => setCurrentParking({ ...currentParking, localizacao: text })}
            placeholder="Localização"
          />
          <TextInput
            style={styles.input}
            value={currentParking.capacidade || ""}
            onChangeText={(text) => setCurrentParking({ ...currentParking, capacidade: text })}
            placeholder="Capacidade"
          />
          <Button title="Salvar" onPress={() => handleSaveParking(currentParking)} />
          <Button title="Cancelar" onPress={() => setShowParkingForm(false)} />
        </View>
      </Modal>

      <Modal visible={showSpotForm} onRequestClose={() => setShowSpotForm(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{currentSpot.id ? "Editar Vaga" : "Adicionar Vaga"}</Text>
          <TextInput
            style={styles.input}
            value={currentSpot.numero || ""}
            onChangeText={(text) => setCurrentSpot({ ...currentSpot, numero: text })}
            placeholder="Número"
          />
          <TextInput
            style={styles.input}
            value={currentSpot.status || ""}
            onChangeText={(text) => setCurrentSpot({ ...currentSpot, status: text })}
            placeholder="Status"
          />
          <TextInput
            style={styles.input}
            value={currentSpot.tipo || ""}
            onChangeText={(text) => setCurrentSpot({ ...currentSpot, tipo: text })}
            placeholder="Tipo"
          />
          <Button title="Salvar" onPress={() => handleSaveSpot(currentSpot)} />
          <Button title="Cancelar" onPress={() => setShowSpotForm(false)} />
        </View>
      </Modal>
    </View>
  );
};const styles = StyleSheet.create({
  parkingManagement: {
    flex: 1,
    padding: 5,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748', // Azul escuro
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D3748', // Azul escuro
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1A202C', // Azul escuro quase preto
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  parkingItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  parkingItemText: {
    fontSize: 16,
    color: '#2D3748', // Azul escuro
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#2B6CB0', // Azul cinza escuro
    padding: 8,
    borderRadius: 5,
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748', // Azul escuro
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  spotSection: {
    marginTop: 20,
  },
  spotItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  spotItemText: {
    fontSize: 16,
    color: '#2D3748', // Azul escuro
  },
});

export default ParkingManagement;
