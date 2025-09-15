import React, { useEffect, useState } from "react";
import { getDashboard, listUsers, addUser, listStoresAdmin, addStore } from "./api";

export default function AdminPages({ page }) {
  if (page === "dashboard") return <Dashboard />;
  if (page === "usersList") return <UsersList />;
  if (page === "addUser") return <AddUser />;
  if (page === "storesList") return <StoresList />;
  if (page === "addStore") return <AddStore />;
}

function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getDashboard().then(setData);
  }, []);
  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Users: {data.usersCount}</p>
      <p>Stores: {data.storesCount}</p>
      <p>Ratings: {data.ratingsCount}</p>
    </div>
  );
}

function UsersList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    listUsers().then((res) => setUsers(res.users));
  }, []);
  return (
    <div>
      <h2>All Users</h2>
      <ul>{users.map((u) => <li key={u._id}>{u.name} – {u.role}</li>)}</ul>
    </div>
  );
}

function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "NORMAL_USER" });
  const [msg, setMsg] = useState("");
  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function handleSubmit(e) {
    e.preventDefault();
    try { await addUser(form); setMsg("User added"); } catch (err) { setMsg("Error"); }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add User</h2>
      <input placeholder="Name" name="name" onChange={handleChange} />
      <input placeholder="Email" name="email" onChange={handleChange} />
      <input placeholder="Password" name="password" type="password" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="NORMAL_USER">Normal</option>
        <option value="STORE_OWNER">Owner</option>
        <option value="SYSTEM_ADMIN">Admin</option>
      </select>
      <button type="submit">Add</button>
      <p>{msg}</p>
    </form>
  );
}

function StoresList() {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    listStoresAdmin().then((res) => setStores(res.stores));
  }, []);
  return (
    <div>
      <h2>All Stores</h2>
      <ul>{stores.map((s) => <li key={s._id}>{s.name}</li>)}</ul>
    </div>
  );
}

function AddStore() {
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [msg, setMsg] = useState("");
  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function handleSubmit(e) {
    e.preventDefault();
    try { await addStore(form); setMsg("Store added"); } catch (err) { setMsg("Error"); }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Store</h2>
      <input placeholder="Name" name="name" onChange={handleChange} />
      <input placeholder="Email" name="email" onChange={handleChange} />
      <input placeholder="Address" name="address" onChange={handleChange} />
      <button type="submit">Add</button>
      <p>{msg}</p>
    </form>
  );
}
