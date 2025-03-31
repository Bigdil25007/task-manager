# Task Manager

Une application web de gestion de tâches permettant de créer, modifier et suivre des tâches avec leurs sous-tâches et commentaires.

## Technologies utilisées

### Backend

- **Node.js** : Environnement d'exécution JavaScript
- **Express.js** : Framework web pour Node.js
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM (Object Data Modeling) pour MongoDB

### Frontend

- **EJS (Embedded JavaScript)** : Moteur de template pour générer du HTML dynamique
- **Bulma** : Framework CSS moderne basé sur Flexbox
- **JavaScript** : Pour la gestion dynamique des formulaires

## Installation et lancement

1. Cloner le repository :

```bash
git clone https://github.com/Bigdil25007/task-manager.git
cd task-manager
```

2. Installer les dépendances :

```bash
npm install
```

3. Configurer la base de données :

- Assurez-vous que MongoDB est installé et en cours d'exécution
- Assurez-vous d'avoir un fichier `.env` contenant une variable **MONGO_URI** (exemple : MONGO_URI=mongodb://localhost:27017/taskmanager)

4. Lancer l'application :

```bash
npm run start
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## Structure du projet

```
task-manager/
├── controllers/
│   ├── apiController.js    # Contrôleur pour l'API REST
│   └── webController.js    # Contrôleur pour l'interface web
├── db/
│   ├── dump.json          # Dump de la base de données
│   └── schema.js          # Schéma de validation des données
├── models/
│   └── Task.js            # Modèle Mongoose pour les tâches
├── public/
│   └── style.css          # Styles CSS personnalisés
├── routes/
│   ├── apiRoutes.js       # Routes de l'API REST
│   └── webRoutes.js       # Routes de l'interface web
├── views/
│   ├── partials/          # Partiels EJS réutilisables
│   │   ├── form/          # Composants du formulaire de tâche
│   │   ├── task/          # Composants d'affichage de tâche
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── task.ejs      # Template de tâche
│   ├── index.ejs         # Page d'accueil
│   ├── task-form.ejs     # Formulaire de tâche
│   ├── confirm.ejs       # Page de confirmation
│   └── error.ejs         # Page d'erreur
├── server.js                 # Point d'entrée de l'application
└── package.json          # Configuration du projet
```

## Base de données

### Schéma de validation

Le schéma de validation (`db/schema.js`) définit la structure des données :

- Validation des champs obligatoires
- Types de données
- Formats spécifiques (email, dates)
- Structures imbriquées (auteur, sous-tâches, commentaires)

### Dumps

Le dossier `db/dump/` contient des sauvegardes de la base de données pour :

- Faciliter la restauration en cas de problème
- Permettre la migration vers d'autres environnements
- Servir de données de test

## API REST

### Routes disponibles

#### Tâches

- `GET /api/tasks` : Récupérer toutes les tâches
- `GET /api/tasks/:id` : Récupérer une tâche spécifique
- `POST /api/tasks` : Créer une nouvelle tâche
- `PUT /api/tasks/:id` : Mettre à jour une tâche
- `DELETE /api/tasks/:id` : Supprimer une tâche

#### Exemples d'utilisation

1. Créer une tâche :

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Nouvelle tâche",
    "description": "Description de la tâche",
    "auteur": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com"
    },
    "categorie": "travail",
    "etiquettes": ["urgent", "important"],
    "priorite": "haute",
    "statut": "à faire",
    "echeance": "2024-04-01"
  }'
```

2. Récupérer toutes les tâches :

```bash
curl http://localhost:3000/api/tasks
```

3. Mettre à jour une tâche :

```bash
curl -X PUT http://localhost:3000/api/tasks/65f2e8b7c261e8a1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Tâche mise à jour",
    "description": "Nouvelle description",
    "auteur": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com"
    },
    "categorie": "personnel",
    "etiquettes": ["urgent", "important", "urgent"],
    "priorite": "critique",
    "statut": "en cours",
    "echeance": "2024-04-15",
    "sousTaches": [
      {
        "titre": "Première sous-tâche",
        "statut": "à faire",
        "echeance": "2024-04-10"
      }
    ],
    "commentaires": [
      {
        "contenu": "Nouveau commentaire",
        "auteur": {
          "nom": "Martin",
          "prenom": "Sophie",
          "email": "sophie@example.com"
        }
      }
    ]
  }'
```

## Interface utilisateur

### Pages disponibles

#### 1. Page d'accueil (`/`)

- Liste des tâches existantes
- Bouton pour créer une nouvelle tâche
- Actions rapides (modifier, supprimer) pour chaque tâche
- Affichage des informations principales (titre, statut, priorité)

#### 2. Formulaire de tâche (`/tasks/new` ou `/tasks/edit`)

- Création ou modification de tâche
- Champs organisés en sections :
  - Informations de base (titre, description, auteur)
  - Catégorisation (catégorie, étiquettes)
  - Statut (priorité, état)
  - Date d'échéance
  - Sous-tâches (ajout/suppression dynamique)
  - Commentaires (ajout/suppression dynamique)

#### 3. Page de confirmation (`/confirm`)

- Confirmation des actions importantes (suppression)
- Récapitulatif des modifications

#### 4. Page d'erreur

- Affichage des messages d'erreur
- Bouton de retour à l'accueil

## Fonctionnalités implémentées

### Backend

- ✅ CRUD complet des tâches
- ✅ Validation des données
- ✅ Gestion des sous-tâches
- ✅ Gestion des commentaires
- ✅ Historique des modifications (partiel)
- ❌ Historique des sous-tâches
- ❌ Historique des commentaires

### Frontend

- ✅ Interface responsive avec Bulma
- ✅ Formulaires dynamiques
- ✅ Gestion des sous-tâches et commentaires
- ✅ Confirmation des actions importantes
- ❌ Filtrage des tâches
- ❌ Tri des tâches
- ❌ Recherche de tâches

## Fonctionnalités en cours

1. Système d'historique

   - Implémentation de l'historique pour les sous-tâches
   - Implémentation de l'historique pour les commentaires
   - Interface de visualisation de l'historique

2. Interface de filtrage et tri
   - Filtres par catégorie
   - Filtres par statut
   - Filtres par priorité
   - Tri par date
   - Recherche par titre ou description

## Bonnes pratiques

1. Sécurité

   - Validation des données côté serveur
   - Protection contre les injections
   - Gestion des erreurs

2. UX/UI

   - Interface intuitive
   - Retours visuels des actions
   - Confirmation des actions importantes
   - Design responsive

3. Code
   - Structure modulaire
   - Séparation des préoccupations
   - Réutilisation des composants
   - Documentation claire
