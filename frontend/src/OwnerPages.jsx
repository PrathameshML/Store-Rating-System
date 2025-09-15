import React from "react";

export default function OwnerPages({ page }) {
  if (page === "dashboard") return <Dashboard />;
}

function Dashboard() {
  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <p>Here you can manage your store ratings.</p>
    </div>
  );
}
