const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Page d'accueil
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
