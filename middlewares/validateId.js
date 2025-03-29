const mongoose = require("mongoose");
const Task = require("../models/Task");
const validateId = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  if (!(await Task.findById(req.params.id))) {
    return res.status(404).json({ message: "Tâche non trouvée" });
  }

  next();
};

module.exports = validateId;
