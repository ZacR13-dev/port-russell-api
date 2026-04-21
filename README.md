# Port de plaisance Russell - API

API REST pour la gestion des catways et des reservations du port de plaisance Russell.

## Technologies

- Node.js
- Express
- MongoDB (Mongoose)
- EJS (moteur de template)
- JWT (authentification)
- bcrypt (chiffrement des mots de passe)

## Installation

1. Cloner le depot :

```
git clone https://github.com/<username>/port-russell-api.git
cd port-russell-api
```

2. Installer les dependances :

```
npm install
```

3. Creer un fichier `.env` a la racine (voir `.env.example`) :

```
URL_MONGO=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/port_russell
SECRET_KEY=GTGh6rdP54GT76
PORT=3000
```

4. Importer les donnees initiales (catways, reservations, utilisateur admin) :

```
npm run import
```

Un utilisateur par defaut est cree :
- email : `admin@russell.com`
- mot de passe : `admin1234`

5. Demarrer le serveur :

```
npm start
```

En mode developpement (avec nodemon) :

```
npm run dev
```

L'application est accessible a l'adresse `http://localhost:3000`.

## Structure du projet

```
port-russell-api/
├── app.js              # configuration Express
├── bin/www             # point d'entree
├── db/mongo.js         # connexion MongoDB
├── data/               # donnees d'import et script
├── models/             # schemas Mongoose
├── services/           # logique metier
├── routes/             # routes API et pages
├── middlewares/        # middleware JWT
├── views/              # templates EJS
├── public/             # fichiers statiques (CSS)
├── docs/               # documentation JSDoc generee
└── README.md
```

## Documentation du code (JSDoc)

Le code est documente avec JSDoc. La documentation HTML est disponible dans le
dossier `docs/` (ouvrir `docs/index.html` dans un navigateur).

Pour la regenerer :

```
npm run doc
```

## Fonctionnalites

- Authentification avec JWT (token stocke en cookie)
- CRUD sur les catways
- CRUD sur les reservations (sous-ressources des catways)
- CRUD sur les utilisateurs
- Tableau de bord avec les reservations en cours
- Documentation de l'API accessible via `/documentation`

## Routes de l'API

Voir la documentation complete a l'adresse `/documentation`.

### Authentification
- `POST /login` : connexion
- `GET /logout` : deconnexion

### Catways
- `GET /catways` : liste
- `GET /catways/:id` : detail
- `POST /catways` : creer
- `PUT /catways/:id` : modifier l'etat
- `DELETE /catways/:id` : supprimer

### Reservations
- `GET /catways/:id/reservations`
- `GET /catways/:id/reservations/:idReservation`
- `POST /catways/:id/reservations`
- `PUT /catways/:id/reservations/:idReservation`
- `DELETE /catways/:id/reservations/:idReservation`

### Utilisateurs
- `GET /users/`
- `GET /users/:email`
- `POST /users/`
- `PUT /users/:email`
- `DELETE /users/:email`

## Deploiement

L'application peut etre deployee sur des plateformes comme Render, Railway, Heroku ou Vercel.

### Exemple avec Render

1. Pousser le projet sur GitHub.
2. Creer un nouveau Web Service sur Render et connecter le depot.
3. Configurer :
   - Build Command : `npm install`
   - Start Command : `npm start`
4. Ajouter les variables d'environnement (`URL_MONGO`, `SECRET_KEY`, `PORT`).
5. Deployer.

## Compte de test

- email : `admin@russell.com`
- mot de passe : `admin1234`
