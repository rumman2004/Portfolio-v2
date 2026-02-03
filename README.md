# 🚀 Portfolio V2 - Full Stack MERN Portfolio

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A robust, high-performance Personal Portfolio website built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a modern **Glassmorphism/Neumorphism UI**, a fully dynamic **Admin Dashboard** for content management, real-time weather data, and automated email notifications.

---

## ✨ Key Features

### 🎨 Frontend (Client)
* **Modern UI/UX:** Built with **React + Vite** and **Tailwind CSS**, featuring Glassmorphism and Neumorphism design elements.
* **Animations:** Smooth page transitions and scroll animations using **Framer Motion**.
* **Real-time Utilities:** Includes a custom **Analog Clock & Weather Card** that syncs with backend location data (OpenMeteo API).
* **GitHub Activity:** Live visualization of GitHub contributions.
* **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.

### ⚙️ Backend (API)
* **Secure API:** RESTful API built with **Node.js & Express**.
* **Admin Authentication:** Secure JWT-based login system for the portfolio owner.
* **Dynamic Content Management:** CRUD operations for Projects, Skills, Experience, Certificates, and Social Links.
* **Email Automation:** "Contact Me" form automatically saves messages to MongoDB and sends email notifications via **Nodemailer** (Admin Notification + User Auto-Reply).
* **Cloud Storage:** Image uploads (for projects/certificates) handled via **Cloudinary**.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Nodemailer |
| **Authentication** | JWT (JSON Web Tokens), BCrypt |
| **Storage** | Cloudinary (Images), MongoDB Atlas (Data) |
| **Deployment** | Vercel (Frontend & Backend) |

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/portfolio-v2.git](https://github.com/your-username/portfolio-v2.git)
cd portfolio-v2
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following credentials:
```Code snippet
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (Auto-created on first run)
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_secure_password

# Email Automation (Nodemailer)
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_google_app_password
YOUR_NAME="Your Name"

# Frontend URL (For CORS)
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a .env file in the frontend folder:
```Code snippet
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```
<hr>

### 📂 Project Structure
```bash
portfolio-v2/
├── backend/                # Express API
│   ├── config/             # DB Connection
│   ├── controller/         # Logic (Auth, Projects, Contacts)
│   ├── model/              # Mongoose Schemas
│   ├── routes/             # API Routes
│   ├── utils/              # Email Service & Helpers
│   └── server.js           # Entry Point
│
└── frontend/               # React Client
    ├── src/
    │   ├── components/     # Reusable UI (Forms, Cards, Navbar)
    │   ├── context/        # Theme & Auth Context
    │   ├── pages/          # Public & Admin Pages
    │   ├── sections/       # Hero, About, Projects, Contact
    │   └── services/       # Axios API Calls (api.js)
    └── vercel.json         # Deployment Config
```
<hr>

### 🌍 Deployment
Deploying to Vercel
This project is optimized for Vercel deployment (separate Frontend/Backend structure).

Backend:
* Push backend folder to Vercel.
* Add all .env variables in Vercel Project Settings.
* Ensure vercel.json exists in backend/ for serverless routing.

Frontend:
* Push frontend folder to Vercel.
* Add VITE_API_URL (your deployed backend URL) to Environment Variables.
* Ensure vercel.json exists in frontend/ for SPA routing (fixes 404s).
<hr>

### 🤝 Contact
Rumman Ahmed <br>
📧 Email: rumman.ahmed.work@gmail.com <br>
🌐 Portfolio: https://rumman-portfolio-ryuu.vercel.app <br>
🐙 GitHub: https://github.com/rumman2004 <br>

<hr>
Made with ❤️ and MERN Stack.
