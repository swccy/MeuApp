import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getSession, getUserById, updateUserById, isValidEmail } from "../storage/auth";

export default function EditAccountScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (!s) return navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      const u = await getUserById(s.userId);
      if (!u) return navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      setUser(u);
      setUsername(u.username);
      setEmail(u.email);
    })();
  }, []);

  const handleSave = async () => {
    if (!username || !email) return Alert.alert("Erro", "Nome e e-mail obrigatórios.");
    if (!isValidEmail(email)) return Alert.alert("Erro", "E-mail inválido.");

    const patch = { username: username.trim(), email: email.trim().toLowerCase() };
    if (password) patch.password = password;

    await updateUserById(user.id, patch);

    Alert.alert("Sucesso", "Dados atualizados.", [
      { text: "Ok", onPress: () => navigation.goBack() }
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Conta</Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nome de usuário"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nova senha (deixe em branco)"
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    width: "92%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },

  title: {
    fontWeight: "800",
    color: "#0D47A1",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#90CAF9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F8FBFF",
    fontSize: 15,
  },

  primaryBtn: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  backBtn: {
    marginTop: 14,
    alignItems: "center",
  },

  backText: {
    color: "#0D47A1",
    fontWeight: "700",
  },
});
