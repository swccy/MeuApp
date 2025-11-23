import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { clearSession } from "../storage/auth";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.header}>Bem-vindo!</Text>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("IMC")}
      >
        <Text style={styles.cardTitle}>Calcular IMC</Text>
        <Text style={styles.cardSubtitle}>Avalie seu índice corporal</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("Todo")}
      >
        <Text style={styles.cardTitle}>Tarefas</Text>
        <Text style={styles.cardSubtitle}>Gerencie suas atividades</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={async () => {
          await clearSession();
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0D47A1",
    marginBottom: 30,
  },

  card: {
    width: "12%",
    height: "12%",
    backgroundColor: "#ffffffff",
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#ffffffff",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D47A1",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#1565C0",
    marginTop: 4,
  },

  logoutBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#BBDEFB",
    borderRadius: 10,
  },

  logoutText: {
    color: "#0D47A1",
    fontWeight: "700",
    fontSize: 16,
  },
});
