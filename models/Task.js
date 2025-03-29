const mongoose = require("mongoose");

const auteurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
});

const sousTacheSchema = new mongoose.Schema({
  titre: String,
  statut: String,
  echeance: { type: Date, default: Date.now },
});

const commentaireSchema = new mongoose.Schema({
  auteur: auteurSchema,
  date: { type: Date, default: Date.now },
  contenu: String,
});

const historiqueSchema = new mongoose.Schema({
  champModifie: String,
  ancienneValeur: String,
  nouvelleValeur: String,
  date: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  echeance: Date,
  statut: {
    type: String,
    enum: ["à faire", "en cours", "terminée", "annulée"],
    default: "à faire",
  },
  priorite: {
    type: String,
    enum: ["basse", "moyenne", "haute", "critique"],
  },
  auteur: { type: auteurSchema, required: true },
  categorie: String,
  etiquettes: [String],
  sousTaches: [sousTacheSchema],
  commentaires: [commentaireSchema],
  historiqueModification: [historiqueSchema],
});

module.exports = mongoose.model("Task", taskSchema);
