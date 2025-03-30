/**
 * Génère l'historique des modifications d'un champ en comparant l'ancien et le nouveau document
 * @param {Object} ancienDoc - Document original avant les modifications
 * @param {Object} nouveauDoc - Document après application des modifications
 * @param {Array<string>} champs - Liste des noms des champs à surveiller et comparer
 * @returns {Array<Object>} Historique des modifications contenant pour chaque changement:
 *   - champModifie: le nom du champ modifié
 *   - ancienneValeur: la valeur avant modification
 *   - nouvelleValeur: la nouvelle valeur
 *   - date: la date de la modification
 */
const generateHistorique = (ancienDoc, nouveauDoc, champs) => {
  const historique = [];
  const date = new Date();

  champs.forEach((champ) => {
    const ancienneValeur = ancienDoc[champ];
    const nouvelleValeur = nouveauDoc[champ];

    // Si la valeur a changé et n'est pas undefined
    if (ancienneValeur !== nouvelleValeur && nouvelleValeur !== undefined) {
      historique.push({
        champModifie: champ,
        ancienneValeur: ancienneValeur?.toString() || "non défini",
        nouvelleValeur: nouvelleValeur?.toString() || "non défini",
        date: date,
      });
    }
  });

  return historique;
};

/**
 * Génère l'historique des modifications d'un tableau d'objets en comparant l'ancien et le nouveau tableau.
 * La fonction détecte trois types de changements :
 * 1. Les suppressions : éléments présents dans l'ancien tableau mais absents du nouveau
 * 2. Les ajouts : éléments présents dans le nouveau tableau mais absents de l'ancien
 * 3. Les modifications : éléments présents dans les deux tableaux mais dont les valeurs ont changé
 *
 * Pour les sous-tâches, les champs surveillés sont : titre, statut et échéance
 * Pour les commentaires, les champs surveillés sont : contenu et date
 *
 * La comparaison des éléments se fait sur la base de leur _id
 *
 * @param {Array<Object>} ancienTableau - Tableau original avant les modifications
 * @param {Array<Object>} nouveauTableau - Tableau après application des modifications
 * @param {string} type - Type de tableau ("sousTaches" ou "commentaires")
 * @returns {Array<Object>} Historique des modifications contenant pour chaque changement:
 *   - champModifie: le nom du champ modifié (format: "type.operation" ou "type.champ")
 *   - ancienneValeur: la valeur avant modification (JSON pour ajout/suppression, toString pour modifications)
 *   - nouvelleValeur: la nouvelle valeur (JSON pour ajout/suppression, toString pour modifications)
 *   - date: la date de la modification
 */
const generateHistoriqueTableau = (ancienTableau, nouveauTableau, type) => {
  const historique = [];
  const date = new Date();
  // Vérifier les suppressions
  ancienTableau.forEach((ancienItem) => {
    const existeEncore = nouveauTableau.some(
      (nouveauItem) =>
        nouveauItem._id?.toString() === ancienItem._id?.toString()
    );

    if (!existeEncore) {
      historique.push({
        champModifie: `${type}.suppression`,
        ancienneValeur: JSON.stringify(ancienItem),
        nouvelleValeur: "supprimé",
        date: date,
      });
    }
  });

  // Vérifier les ajouts et modifications
  nouveauTableau.forEach((nouveauItem) => {
    const ancienItem = ancienTableau.find(
      (item) => item._id?.toString() === nouveauItem._id?.toString()
    );

    if (!ancienItem) {
      // Nouvel élément
      historique.push({
        champModifie: `${type}.ajout`,
        ancienneValeur: "non existant",
        nouvelleValeur: JSON.stringify(nouveauItem),
        date: date,
      });
    } else {
      // Élément modifié
      let champsASuivre;
      if (type === "sousTaches") {
        champsASuivre = ["titre", "statut", "echeance"];
      } else {
        champsASuivre = ["contenu", "date"];
      }

      champsASuivre.forEach((champ) => {
        if (ancienItem[champ] !== nouveauItem[champ]) {
          historique.push({
            champModifie: `${type}.${champ}`,
            ancienneValeur: ancienItem[champ]?.toString() || "non défini",
            nouvelleValeur: nouveauItem[champ]?.toString() || "non défini",
            date: date,
            elementId: nouveauItem._id.toString(),
          });
        }
      });
    }
  });

  return historique;
};

module.exports = { generateHistorique, generateHistoriqueTableau };
