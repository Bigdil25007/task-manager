require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur démarré à cette addresse: http://localhost:${PORT}`),
);
