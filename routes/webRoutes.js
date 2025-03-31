const express = require("express");
const router = express.Router();
const webController = require("../controllers/webController");
const {
  formatDate,
  getStatusColor,
  getPriorityColor,
} = require("../utils/frontendUtils");

// Middleware pour ajouter les fonctions utilitaires à toutes les routes
router.use((req, res, next) => {
  res.locals.formatDate = formatDate;
  res.locals.getStatusColor = getStatusColor;
  res.locals.getPriorityColor = getPriorityColor;
  next();
});

// Routes
router.get("/", webController.getDashboard);
router.post("/tasks/edit", webController.getEditConfirmation);
router.post("/tasks/delete", webController.getDeleteConfirmation);
router.post("/tasks/edit/confirm", webController.confirmEdit);
router.post("/tasks/delete/confirm", webController.confirmDelete);

module.exports = router;
