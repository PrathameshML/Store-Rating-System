import React, { useState } from "react";
import { changePassword } from "./api";

export default function CommonPages({ page }) {
  if (page === "changePassword") return <ChangePassword />;
  if (page === "notFound") return <h2>404 Not Found</h2>;
}

function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await changePassword({ oldPassword, newPassword });
      setMsg("Password changed!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      <input placeholder="Old password" type="password" value={oldPassword} onChange={(e) => setOld(e.target.value)} />
      <input placeholder="New password" type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} />
      <button type="submit">Change</button>
      <p>{msg}</p>
    </form>
  );
}
