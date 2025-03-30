const Task = require("../models/Task");
const { sortSubDocuments } = require("../utils/sortSubDocuments");
const {
  buildFilter,
  buildSort,
  sortByPriorite,
} = require("../utils/filterTasks");

const getAllTasks = async (req, res) => {
  try {
    // Construction de la requête de filtrage
    const query = buildFilter(req.query);
    // Construction du tri
    const sort = buildSort(req.query);

    let tasks;

    // Si on trie par priorité, on gère manuellement le tri
    if (sort?.prioriteOrder) {
      tasks = await Task.find(query);
      tasks = sortByPriorite(tasks, sort);
    } else {
      // Sinon on utilise la méthode de tri de MongoDB
      tasks = await Task.find(query).sort(sort);
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Mise à jour des champs simples
    const updateData = { ...req.body };
    delete updateData.sousTaches;
    delete updateData.commentaires;
    delete updateData.etiquettes;

    // Mise à jour des sous-tâches
    if (req.body.sousTaches) {
      task.sousTaches = sortSubDocuments(task.sousTaches, req.body.sousTaches);
    }

    // Mise à jour des commentaires
    if (req.body.commentaires) {
      task.commentaires = sortSubDocuments(
        task.commentaires,
        req.body.commentaires,
      );
    }

    // Mise à jour des étiquettes
    if (req.body.etiquettes) {
      task.etiquettes = req.body.etiquettes;
    }

    // Mise à jour des autres champs
    Object.assign(task, updateData);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche supprimée avec succès", deletedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
