/**
 * Mise à jour des sous-tâches en comparant les documents existants avec les nouveaux.
 * Si un document a un _id:
 * - S'il ne contient que l'_id, il sera supprimé
 * - Sinon ses propriétés seront mises à jour
 * Si un document n'a pas d'_id, il sera ajouté comme nouveau
 *
 * @param {Array} existingDocs - Les sous-tâches existantes dans la base de données
 * @param {Array} newDocs - Les nouvelles sous-tâches à mettre à jour/ajouter/supprimer
 * @returns {Array} Les sous-tâches mises à jour après traitement
 */
const sortSubDocuments = (existingDocs, newDocs) => {
  // Si newDocs est vide, on garde tous les documents existants
  if (!newDocs || newDocs.length === 0) {
    return existingDocs;
  }

  const docsToKeep = [];

  // Pour chaque document existant
  for (const existingDoc of existingDocs) {
    // On cherche s'il y a une mise à jour pour ce document
    const updateDoc = newDocs.find(
      (doc) => doc._id === existingDoc._id.toString()
    );

    if (updateDoc) {
      // Si on trouve une mise à jour
      if (Object.keys(updateDoc).length === 1) {
        // Si on a seulement l'ID, on supprime ce document
        continue;
      }
      // Sinon on met à jour
      Object.assign(existingDoc, updateDoc);
      docsToKeep.push(existingDoc);
    } else {
      // Si pas de mise à jour, on garde le document existant
      docsToKeep.push(existingDoc);
    }
  }

  // On ajoute les nouveaux documents
  for (const newDoc of newDocs) {
    if (!newDoc._id) {
      docsToKeep.push(newDoc);
    }
  }

  return docsToKeep;
};

module.exports = { sortSubDocuments };
