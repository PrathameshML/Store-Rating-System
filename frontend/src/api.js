import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data.data;
}

export async function signup(payload) {
  const res = await api.post("/auth/signup", payload);
  return res.data.data;
}

export async function changePassword(payload) {
  const res = await api.post("/auth/change-password", payload);
  return res.data.data;
}

export async function getStores(params) {
  const res = await api.get("/stores", { params });
  return res.data.data;
}

export async function getStore(id) {
  const res = await api.get(`/stores/${id}`);
  return res.data.data;
}

export async function createStore(payload) {
  const res = await api.post("/stores", payload);
  return res.data.data;
}

export async function submitRating(storeId, payload) {
  const res = await api.post(`/stores/${storeId}/ratings`, payload);
  return res.data.data;
}

export async function getDashboard() {
  const res = await api.get("/admin/dashboard");
  return res.data.data;
}

export async function listUsers() {
  const res = await api.get("/admin/users");
  return res.data.data;
}

export async function addUser(payload) {
  const res = await api.post("/admin/users", payload);
  return res.data.data;
}

export async function listStoresAdmin() {
  const res = await api.get("/admin/stores");
  return res.data.data;
}

export async function addStore(payload) {
  const res = await api.post("/admin/stores", payload);
  return res.data.data;
}
