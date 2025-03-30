/**
 * Construction de la requête de filtrage pour les tâches
 * @param {Object} queryParams - Les paramètres de la requête
 * @param {string} [queryParams.statut] - Filtre par statut de la tâche (à faire, en cours, terminée, annulée)
 * @param {string} [queryParams.priorite] - Filtre par niveau de priorité (basse, moyenne, haute, critique)
 * @param {string} [queryParams.categorie] - Filtre par catégorie
 * @param {string|string[]} [queryParams.etiquettes] - Filtre par étiquettes (une ou plusieurs)
 * @param {string} [queryParams.avant] - Date limite maximale (format ISO)
 * @param {string} [queryParams.apres] - Date limite minimale (format ISO)
 * @param {string} [queryParams.q] - Terme de recherche dans le titre et la description
 * @returns {Object} La requête de filtrage au format MongoDB
 */
const buildFilter = (queryParams) => {
  const query = {};
  const { statut, priorite, categorie, etiquettes, avant, apres, q } =
    queryParams;

  // Filtre par statut
  if (statut) {
    query.statut = statut;
  }

  // Filtre par priorité
  if (priorite) {
    query.priorite = priorite;
  }

  // Filtre par catégorie
  if (categorie) {
    query.categorie = categorie;
  }

  // Filtre par étiquettes (recherche si la tâche contient toutes les étiquettes)
  if (etiquettes) {
    const etiquettesArray = Array.isArray(etiquettes)
      ? etiquettes
      : [etiquettes];
    query.etiquettes = { $all: etiquettesArray };
  }

  // Filtre par date limite
  if (avant || apres) {
    query.echeance = {};
    if (avant) {
      query.echeance.$lte = new Date(avant);
    }
    if (apres) {
      query.echeance.$gte = new Date(apres);
    }
  }

  // Recherche texte dans titre et description
  if (q) {
    query.$or = [
      { titre: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  return query;
};

/**
 * Construction du tri pour les tâches selon les paramètres spécifiés
 * @param {Object} queryParams - Les paramètres de la requête HTTP
 * @param {string} [queryParams.tri] - Champ sur lequel effectuer le tri:
 *   - "dateEcheance": tri par date d'échéance
 *   - "priorite": tri par niveau de priorité (critique, haute, moyenne, basse)
 *   - "dateCreation": tri par date de création de la tâche
 * @param {string} [queryParams.ordre] - Sens du tri:
 *   - "asc": ordre croissant (A->Z, ancien->récent, basse->critique)
 *   - "desc": ordre décroissant (Z->A, récent->ancien, critique->basse)
 * @returns {Object|null} Un objet de tri au format MongoDB avec les champs et l'ordre spécifiés,
 *                       ou null si aucun tri n'est demandé ou si le champ de tri est invalide
 */
const buildSort = (queryParams) => {
  const { tri, ordre } = queryParams;
  if (!tri) return null;

  let sort = {};
  switch (tri) {
    case "echeance":
      sort = { echeance: ordre === "desc" ? -1 : 1 };
      break;
    case "priorite":
      sort = { priorite: ordre === "desc" ? -1 : 1 };
      break;
    case "dateCreation":
      sort = { dateCreation: ordre === "desc" ? -1 : 1 };
      break;
    default:
      return null;
  }

  return sort;
};

/**
 * Obtient l'ordre de priorité pour une tâche
 * @param {string} priorite - La priorité de la tâche (basse, moyenne, haute, critique)
 * @returns {number} L'ordre de priorité (4 pour critique, 3 pour haute, 2 pour moyenne, 1 pour basse)
 */
const getPrioriteOrder = (priorite) => {
  const ordrePriorite = {
    critique: 4,
    haute: 3,
    moyenne: 2,
    basse: 1,
  };
  return ordrePriorite[priorite] || 0;
};

/**
 * Trie les tâches par priorité selon l'ordre spécifié
 * @param {Array} tasks - Les tâches à trier provenant de la base de données
 * @param {Object} sort - L'objet de tri contenant la direction du tri
 * @param {number} sort.prioriteOrder - Direction du tri (-1 pour descendant, 1 pour ascendant)
 * @returns {Array} Les tâches triées par ordre de priorité:
 *   - En ordre ascendant: basse -> moyenne -> haute -> critique
 *   - En ordre descendant: critique -> haute -> moyenne -> basse
 *   Les tâches sans priorité définie sont placées à la fin du tri
 */
const sortByPriorite = (tasks, sort) => {
  // Ajout du champ de tri pour la priorité
  const tasksWithOrder = tasks.map((task) => ({
    ...task.toObject(),
    prioriteOrder: getPrioriteOrder(task.priorite),
  }));

  // Tri des résultats
  return tasksWithOrder.sort((a, b) => {
    return (
      (sort.prioriteOrder === -1 ? -1 : 1) * (a.prioriteOrder - b.prioriteOrder)
    );
  });
};

module.exports = {
  buildFilter,
  buildSort,
  sortByPriorite,
};
