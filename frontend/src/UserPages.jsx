import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStores, getStore, submitRating } from "./api";
import { RatingStars } from "./UIComponents";

export default function UserPages({ page }) {
  if (page === "storeList") return <StoreList />;
  if (page === "storeDetail") return <StoreDetail />;
  if (page === "profile") return <Profile />;
}

function StoreList() {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    getStores().then((res) => setStores(res.data));
  }, []);
  return (
    <div>
      <h2>Stores</h2>
      <ul>
        {stores.map((s) => (
          <li key={s.id}>
            <a href={`/stores/${s.id}`}>{s.name}</a> – Avg: {s.avgRating || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [myRating, setMyRating] = useState(0);

  useEffect(() => {
    getStore(id).then(setStore);
  }, [id]);

  async function handleRate(val) {
    await submitRating(id, { rating: val });
    setMyRating(val);
  }

  if (!store) return <p>Loading...</p>;

  return (
    <div>
      <h2>{store.store.name}</h2>
      <p>{store.store.address}</p>
      <p>Avg Rating: {store.avgRating || "N/A"}</p>
      <h3>Rate this store</h3>
      <RatingStars value={myRating} onChange={handleRate} />
      <h3>All Ratings</h3>
      <ul>
        {store.ratings.map((r) => (
          <li key={r._id}>{r.user.name}: {r.rating} ★ - {r.comment}</li>
        ))}
      </ul>
    </div>
  );
}

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div>
      <h2>My Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
