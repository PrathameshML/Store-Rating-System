import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./UIComponents";
import AuthRoute from "./AuthRoute";

import AuthPages from "./AuthPages";
import CommonPages from "./CommonPages";
import UserPages from "./UserPages";
import AdminPages from "./AdminPages";
import OwnerPages from "./OwnerPages";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<AuthPages page="login" />} />
        <Route path="/signup" element={<AuthPages page="signup" />} />

        {/* Common */}
        <Route
          path="/change-password"
          element={<AuthRoute><CommonPages page="changePassword" /></AuthRoute>}
        />
        <Route path="/not-found" element={<CommonPages page="notFound" />} />

        {/* User */}
        <Route
          path="/stores"
          element={<AuthRoute><UserPages page="storeList" /></AuthRoute>}
        />
        <Route
          path="/stores/:id"
          element={<AuthRoute><UserPages page="storeDetail" /></AuthRoute>}
        />
        <Route
          path="/profile"
          element={<AuthRoute><UserPages page="profile" /></AuthRoute>}
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={<AuthRoute role="SYSTEM_ADMIN"><AdminPages page="dashboard" /></AuthRoute>}
        />
        <Route
          path="/admin/users"
          element={<AuthRoute role="SYSTEM_ADMIN"><AdminPages page="usersList" /></AuthRoute>}
        />
        <Route
          path="/admin/users/add"
          element={<AuthRoute role="SYSTEM_ADMIN"><AdminPages page="addUser" /></AuthRoute>}
        />
        <Route
          path="/admin/stores"
          element={<AuthRoute role="SYSTEM_ADMIN"><AdminPages page="storesList" /></AuthRoute>}
        />
        <Route
          path="/admin/stores/add"
          element={<AuthRoute role="SYSTEM_ADMIN"><AdminPages page="addStore" /></AuthRoute>}
        />

        {/* Owner */}
        <Route
          path="/owner/dashboard"
          element={<AuthRoute role="STORE_OWNER"><OwnerPages page="dashboard" /></AuthRoute>}
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/stores" />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </>
  );
}
