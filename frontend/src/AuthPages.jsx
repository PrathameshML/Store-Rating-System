import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "./api";

export default function AuthPages({ page }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (page === "login") {
        const data = await login(form.email, form.password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        await signup(form);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{page === "login" ? "Login" : "Signup"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {page === "signup" && (
        <>
          <input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
          <input placeholder="Address" name="address" value={form.address} onChange={handleChange} />
        </>
      )}
      <input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
      <input type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
      <button type="submit">{page === "login" ? "Login" : "Signup"}</button>
    </form>
  );
}
