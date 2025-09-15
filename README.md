🏬 Store Rating App

A full-stack web application where users can explore stores, rate them, and manage their accounts. The app provides role-based dashboards for Admins, Store Owners, and Normal Users, ensuring a complete store management and rating experience.

✨ Features
👥 Authentication & Authorization

🔑 Signup, Login, Logout

🔒 JWT Authentication

👤 Role-based Access (Normal User, Store Owner, Admin)

🔐 Change password securely

🛍️ User Dashboard

📋 Browse and search stores

⭐ Submit ratings & comments

🧑‍💻 Manage personal profile

🛠️ Admin Dashboard

👥 Manage Users (add, view, assign roles)

🏬 Manage Stores (add, list)

📊 View statistics (Users, Stores, Ratings)

🏢 Store Owner Dashboard

🏪 Manage own store profile

⭐ Monitor customer ratings

🛠️ Tech Stack
🔹 Frontend

⚛️ React (Vite + React Router DOM)

🌐 Axios for API calls

🎨 CSS (custom + extendable to Tailwind/Bootstrap)

🔹 Backend

🟢 Node.js + Express.js

📦 REST API with structured routes

🔒 JWT for authentication

🔐 bcrypt for password security

🔹 Database

🍃 MongoDB with Mongoose ORM

📂 Project Structure
store-rating-app/
├── backend/              # Node.js + Express + MongoDB
│   └── src/
│       ├── models/       # Mongoose models
│       ├── routes/       # Express routes
│       ├── controllers/  # Business logic
│       └── middleware/   # Auth & validation
│
├── frontend/             # React + Vite
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── AuthPages.jsx
│       ├── AdminPages.jsx
│       ├── UserPages.jsx
│       ├── OwnerPages.jsx
│       └── ...
│
└── docs/                 # Documentation (ERD, API Spec)

🚀 Getting Started
🔧 Prerequisites

Make sure you have installed:

Node.js
 (>=16)

MongoDB
 running locally or via Atlas

📥 Clone the Repository
git clone https://github.com/PrathameshML/store-rating-app.git
cd store-rating-app

⚙️ Setup Backend
cd backend
npm install


Create .env file:

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/store_rating_app
JWT_SECRET=supersecretkey


Seed Admin User:

npm run seed:admin


Run backend:

npm run dev


✅ Server ready at http://localhost:4000

🎨 Setup Frontend
cd frontend
npm install
npm run dev


✅ Frontend ready at http://localhost:3000

🧪 Test Admin Login

Use seeded credentials:

📧 Email: admin@example.com

🔑 Password: Admin@123

👉 Go to http://localhost:3000/login

🖼️ Screenshots
Login Page	Store List	Admin Dashboard

	
	
📊 ERD Diagram

🤝 Contributing

🍴 Fork this repo

🌿 Create a new branch (feature/my-feature)

💾 Commit changes

🚀 Push branch

🔃 Create Pull Request

📜 License

📝 This project is licensed under the MIT License.

👨‍💻 Author

Built with ❤️ by Prathamesh Mali
