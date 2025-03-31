// Fonctions de formatage
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonctions de couleur pour les badges
const getStatusColor = (statut) => {
  const colors = {
    "à faire": "secondary",
    "en cours": "primary",
    terminée: "success",
    annulée: "danger",
  };
  return colors[statut] || "secondary";
};

const getPriorityColor = (priorite) => {
  const colors = {
    basse: "info",
    moyenne: "warning",
    haute: "danger",
    critique: "dark",
  };
  return colors[priorite] || "info";
};

// Fonctions de gestion des formulaires
const formatFormData = (formData) => {
  const data = {};

  for (let [key, value] of formData.entries()) {
    if (key.includes("[")) {
      // Gestion des tableaux (sous-tâches et commentaires)
      const [parent, index, field] = key
        .match(/(\w+)\[(\d+)\]\[(\w+)\]/)
        .slice(1);
      if (!data[parent]) data[parent] = [];
      if (!data[parent][index]) data[parent][index] = {};
      data[parent][index][field] = value;
    } else {
      data[key] = value;
    }
  }

  // Traitement des étiquettes
  if (data.etiquettes) {
    data.etiquettes = data.etiquettes.split(/\s+/).filter((tag) => tag.trim());
  }

  return data;
};

// Fonctions de validation
const validateTask = (task) => {
  const errors = [];

  if (!task.titre?.trim()) {
    errors.push("Le titre est requis");
  }

  if (!task.description?.trim()) {
    errors.push("La description est requise");
  }

  if (!task.echeance) {
    errors.push("L'échéance est requise");
  }

  if (!task.priorite) {
    errors.push("La priorité est requise");
  }

  return errors;
};

module.exports = {
  formatDate,
  getStatusColor,
  getPriorityColor,
  formatFormData,
  validateTask,
};
