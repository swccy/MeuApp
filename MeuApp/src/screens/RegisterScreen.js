import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { addUser, isValidEmail, uid } from "../storage/auth";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  const handleCreate = async () => {
    if (!username || !email || !password) {
      setNote("Preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setNote("E-mail inválido.");
      return;
    }

    const newUser = {
      id: uid(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      profile: { height: "", weight: "" },
      todos: []
    };

    await addUser(newUser);

    Alert.alert("Sucesso", "Conta criada com sucesso!", [
      { text: "Ok", onPress: () => navigation.replace("Login") }
    ]);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>

        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          placeholder="Nome de usuário"
          style={styles.input}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="E-mail"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {note ? <Text style={styles.note}>{note}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
          <Text style={styles.primaryBtnText}>Criar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#03005cff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    elevation: 5
  },

  title: {
    color: "#0D47A1",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#90CAF9",
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 14
  },

  note: {
    width: "100%",
    color: "#b91c1c",
    marginBottom: 10,
    textAlign: "left",
    fontSize: 13
  },

  primaryBtn: {
    width: "100%",
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15
  },

  link: {
    color: "#0D47A1",
    fontSize: 14,
    marginTop: 4
  }
});
