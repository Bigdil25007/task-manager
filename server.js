require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
