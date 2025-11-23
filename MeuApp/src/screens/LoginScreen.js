import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { findUserByCredentials, setSession, getSession } from "../storage/auth";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (s && s.userId) navigation.replace("Home");
    })();
  }, []);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setMsg("Preencha usuário/e-mail e senha.");
      return;
    }

    const user = await findUserByCredentials(identifier.trim(), password);
    if (!user) {
      setMsg("Credenciais inválidas.");
      return;
    }

    await setSession({ userId: user.id });
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          placeholder="Usuário ou e-mail"
          style={styles.input}
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />

        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        {msg ? <Text style={styles.msg}>{msg}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Criar conta</Text>
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
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },

  title: {
    color: "#0D47A1",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },

  subtitle: {
    color: "#1E88E5",
    fontSize: 14,
    marginBottom: 20,
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
    fontSize: 14,
  },

  msg: {
    width: "100%",
    color: "#b91c1c",
    marginBottom: 10,
    textAlign: "left",
    fontSize: 13,
  },

  primaryBtn: {
    width: "100%",
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  link: {
    color: "#0D47A1",
    fontSize: 14,
    marginTop: 4,
  },
});
