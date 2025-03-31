require("dotenv").config();

const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const webRoutes = require("./routes/webRoutes");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/", webRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur démarré à cette addresse: http://localhost:${PORT}`),
);
