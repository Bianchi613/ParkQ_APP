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
    padding: 15, // Padding reduzido
    borderRadius: 10, // Bordas mais arredondadas
    width: '90%', // Ajustei a largura para 90% da tela
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Sombra mais suave
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,  // Sombra para Android
  },
  title: {
    fontSize: 24, // Título menor
    fontWeight: 'bold',
    marginBottom: 5, // Espaçamento reduzido
    color: '#333', // Título escuro
  },
  subtitle: {
    fontSize: 14, // Subtítulo menor
    color: '#555', // Subtítulo mais suave
    marginBottom: 15, // Espaçamento reduzido
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#000', // Botão preto
    paddingVertical: 8, // Padding reduzido
    paddingHorizontal: 16, // Padding reduzido
    borderRadius: 20, // Bordas mais arredondadas
    marginBottom: 8, // Espaçamento reduzido
    width: '100%',
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#000', // Borda preta
    paddingVertical: 8, // Padding reduzido
    paddingHorizontal: 16, // Padding reduzido
    borderRadius: 20, // Bordas mais arredondadas
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff', // Texto branco para contraste
    fontSize: 12, // Fonte menor
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Home;