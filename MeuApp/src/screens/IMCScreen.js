import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getSession, getUserById, updateUserById } from "../storage/auth";

const calculateBMI = (height, weight, unit) => {
  const h = Number(height);
  const w = Number(weight);
  if (!h || !w || h <= 0 || w <= 0) return { ok: false, error: "Altura/peso inválidos" };
  const hMeters = unit === "cm" ? h / 100 : h;
  const bmi = w / (hMeters * hMeters);
  const r = Math.round(bmi * 10) / 10;
  let cat = "";
  if (r < 18.5) cat = "Abaixo do peso";
  else if (r < 25) cat = "Peso normal";
  else if (r < 30) cat = "Sobrepeso";
  else cat = "Obesidade";
  return { ok: true, bmi: r, cat };
};

export default function IMCScreen({ navigation }) {
  const [unit, setUnit] = useState("m");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (!s) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }
      setUserId(s.userId);
      const u = await getUserById(s.userId);
      if (u?.profile) {
        setHeight(u.profile.height || "");
        setWeight(u.profile.weight || "");
      }
    })();
  }, []);

  const handleCalc = () => {
    const res = calculateBMI(height, weight, unit);
    if (!res.ok) return setResult({ error: res.error });
    setResult({ bmi: res.bmi, cat: res.cat });
  };

  const handleSave = async () => {
    if (!userId) return;
    await updateUserById(userId, { profile: { height, weight } });
    Alert.alert("Salvo", "Altura e peso salvos no perfil.");
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>

        <Text style={styles.title}>Calculadora de IMC</Text>

        <View style={styles.unitRow}>
          <TouchableOpacity 
            style={[styles.unit, unit === "m" && styles.unitActive]} 
            onPress={() => setUnit("m")}
          >
            <Text style={unit === "m" ? styles.unitTextActive : styles.unitText}>m</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.unit, unit === "cm" && styles.unitActive]} 
            onPress={() => setUnit("cm")}
          >
            <Text style={unit === "cm" ? styles.unitTextActive : styles.unitText}>cm</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder={unit === "m" ? "Altura (ex: 1.75)" : "Altura (ex: 175)"}
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
          style={styles.input}
        />

        <TextInput
          placeholder="Peso (kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCalc}>
          <Text style={styles.primaryBtnText}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Salvar no perfil</Text>
        </TouchableOpacity>
        {result && (
          <View style={styles.resultBox}>
            {result.error ? (
              <Text style={styles.error}>{result.error}</Text>
            ) : (
              <>
                <Text style={styles.bmiValue}>IMC: {result.bmi}</Text>
                <Text style={styles.bmiCat}>Categoria: {result.cat}</Text>
              </>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "20%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
  },

  title: {
    color: "#0D47A1",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },

  unitRow: {
    flexDirection: "row",
    marginBottom: 14,
    justifyContent: "center",
  },

  unit: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90CAF9",
    marginHorizontal: 6,
  },

  unitActive: {
    backgroundColor: "#1E88E5",
    borderColor: "#1E88E5",
  },

  unitText: {
    color: "#0D47A1",
    fontWeight: "600",
  },

  unitTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  input: {
    borderWidth: 1,
    borderColor: "#90CAF9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
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
  },

  saveBtn: {
    backgroundColor: "#BBDEFB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  saveBtnText: {
    color: "#0D47A1",
    fontWeight: "700",
  },

  resultBox: {
    marginTop: 16,
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
  },

  error: {
    color: "#b91c1c",
    fontWeight: "600",
  },

  bmiValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0D47A1",
  },

  bmiCat: {
    color: "#1565C0",
    marginTop: 4,
  },

  backBtn: {
    marginTop: 16,
    alignItems: "center",
  },

  link: {
    color: "#0D47A1",
    fontWeight: "700",
  },
});
