import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Para navegação

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Park Q</Text>
        <Text style={styles.subtitle}>Bem-Vindo ao Futuro do Estacionamento</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.btnText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.btnText}>Registrar-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fundo branco
  },
  content: {
    backgroundColor: '#ffffff', // Fundo branco para o conteúdo
    padding: 50,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,  // Sombra para Android
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Título escuro
  },
  subtitle: {
    fontSize: 18,
    color: '#555', // Subtítulo mais suave
    marginBottom: 30,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#000', // Botão preto
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor:  '#000',
    borderWidth: 2,
    borderColor: '#000', // Borda preta
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff', // Texto branco para contraste
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Home;
