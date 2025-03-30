const express = require("express");
const router = express.Router();
const apiClient = require("../config/apiClient");

const {
  formatDate,
  getStatusColor,
  getPriorityColor,
} = require("../utils/frontendUtils");

// Page d'accueil
router.get("/", async (req, res) => {
  try {
    const response = await apiClient.get("/tasks");
    res.locals.tasks = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.locals.tasks = [];
  }
  res.render("index", {
    tasks: res.locals.tasks,
    formatDate,
    getStatusColor,
    getPriorityColor,
  });
});

module.exports = router;
