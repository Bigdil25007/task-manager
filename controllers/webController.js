const apiClient = require("../config/apiClient");

// Page d'accueil avec la liste des tâches
const getDashboard = async (req, res) => {
  try {
    const response = await apiClient.get("/tasks");
    res.locals.tasks = response.data;
    res.render("index", {
      tasks: res.locals.tasks,
      formatDate: res.locals.formatDate,
      getStatusColor: res.locals.getStatusColor,
      getPriorityColor: res.locals.getPriorityColor,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.locals.tasks = [];
    res.render("index", {
      tasks: res.locals.tasks,
      formatDate: res.locals.formatDate,
      getStatusColor: res.locals.getStatusColor,
      getPriorityColor: res.locals.getPriorityColor,
    });
  }
};

// Page de confirmation pour la modification
const getEditConfirmation = async (req, res) => {
  try {
    const { taskId } = req.body;
    const response = await apiClient.get(`/tasks/${taskId}`);
    const task = response.data;

    res.render("confirm", {
      title: "Modifier la tâche",
      message: `Êtes-vous sûr de vouloir modifier la tâche "${task.titre}" ?`,
      action: "/tasks/edit/confirm",
      taskId: taskId,
      confirmButtonClass: "is-warning",
      confirmIcon: "✎",
      confirmText: "Modifier",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    res.render("error", {
      error: "Impossible de récupérer les informations de la tâche",
    });
  }
};

// Page de confirmation pour la suppression
const getDeleteConfirmation = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const response = await apiClient.get(`/tasks/${taskId}`);
    const task = response.data;

    res.render("confirm", {
      title: "Supprimer la tâche",
      message: `Êtes-vous sûr de vouloir supprimer la tâche "${task.titre}" ? Cette action est irréversible.`,
      action: "/tasks/delete/confirm",
      taskId: taskId,
      confirmButtonClass: "is-danger",
      confirmIcon: "🗑",
      confirmText: "Supprimer",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    res.render("error", {
      error: "Impossible de récupérer les informations de la tâche",
    });
  }
};

// Confirmation de la modification
const confirmEdit = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    await apiClient.put(`/tasks/${taskId}`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de la modification de la tâche:", error);
    res.render("error", {
      error: "Une erreur est survenue lors de la modification de la tâche",
    });
  }
};

// Confirmation de la suppression
const confirmDelete = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    await apiClient.delete(`/tasks/${taskId}`);
    res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.render("error", {
      error: "Une erreur est survenue lors de la suppression de la tâche",
    });
  }
};

module.exports = {
  getDashboard,
  getEditConfirmation,
  getDeleteConfirmation,
  confirmEdit,
  confirmDelete,
};
