import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native";
import { getSession, getUserById, updateUserById } from "../storage/auth";

export default function TodoScreen({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (!s) return navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      setUserId(s.userId);
      const u = await getUserById(s.userId);
      setTodos(u?.todos || []);
    })();
  }, []);

  const persist = async (nextTodos) => {
    setTodos(nextTodos);
    if (userId) await updateUserById(userId, { todos: nextTodos });
  };

  const addTask = async () => {
    if (!text.trim()) return Alert.alert("Aviso", "Digite algo.");
    const t = { id: Date.now().toString(), text: text.trim(), done: false };
    await persist([...todos, t]);
    setText("");
  };

  const toggle = async (id) => {
    await persist(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = async (id) => {
    await persist(todos.filter(t => t.id !== id));
  };

  const edit = (t) => {
    Alert.prompt(
      "Editar tarefa",
      "",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: async (value) => {
            if (value && value.trim()) {
              await persist(
                todos.map(tt => tt.id === t.id ? { ...tt, text: value.trim() } : tt)
              );
            }
          },
        },
      ],
      "plain-text",
      t.text
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>Lista de Tarefas</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Nova tarefa..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={todos}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => toggle(item.id)}>
                <Text style={item.done ? styles.doneText : styles.text}>
                  {item.text}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.small} onPress={() => edit(item)}>
                <Text style={styles.smallText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.small, styles.deleteBtn]}
                onPress={() => remove(item.id)}
              >
                <Text style={styles.smallText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "20%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 4,
  },

  title: {
    color: "#0D47A1",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 14,
    textAlign: "center",
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#90CAF9",
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: "#F8FBFF",
  },

  addBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce7f9",
    backgroundColor: "#F3F8FF",
    marginBottom: 10,
  },

  text: {
    color: "#0D1B2A",
    fontSize: 15,
  },

  doneText: {
    textDecorationLine: "line-through",
    color: "#6b7280",
    fontSize: 15,
  },

  small: {
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  smallText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  deleteBtn: {
    backgroundColor: "#d32f2f",
  },

  backBtn: {
    marginTop: 16,
    alignItems: "center",
  },

  backText: {
    color: "#0D47A1",
    fontWeight: "700",
  },
});
