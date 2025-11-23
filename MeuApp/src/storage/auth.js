import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@app_users_v2";
const SESSION_KEY = "@app_session_v2";

export async function getUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUsers(users) {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export async function addUser(user) {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
}

export async function updateUserById(id, patch) {
  const users = await getUsers();
  const updated = users.map(u => (u.id === id ? { ...u, ...patch } : u));
  await saveUsers(updated);
  return updated.find(u => u.id === id);
}

export async function findUserByCredentials(identifier, password) {
  const users = await getUsers();
  identifier = (identifier || "").toLowerCase();
  return users.find(u => (u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier) && u.password === password) || null;
}

export async function getUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function setSession(session) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export async function getSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {}
}

export const uid = () => Date.now().toString();
export const isValidEmail = (s) => /\S+@\S+\.\S+/.test(s);
