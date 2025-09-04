/*const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const profileRoutes = require('./routes/profile');
const articlesRouter = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Utilisation des routes
app.use('/api/profile', profileRoutes);
app.use('/api/articles', articlesRouter);

// Route de test
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend connecté avec succès!' });
});

/*
// Pour toutes les autres routes, servir index.html (pour React Router)
app.get('*', (req, res) => {
  // Ignorer les routes API
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


// Pour servir React uniquement en production
console.log("Test");
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  console.log("Le build est trouvé");
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;*/


// backend/index.js - Version API uniquement pour Render

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Test');

// Configuration CORS pour permettre les requêtes depuis Vercel
app.use(cors({
    origin: [
        'https://site-web-perso-cjp2.onrender.com', // URL render obtenue après beaucoup d'essai (alors que ce n'est pas compliqué)
        'http://localhost:3000' // Pour le développement local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', require('./routes/articles')); // Ajustez selon vos routes

// Route de santé pour vérifier que le backend fonctionne
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// Route racine pour l'API
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Backend is running',
        endpoints: {
            health: '/health',
            articles: '/api/articles',
            categories: '/api/articles/categories/stats'
        }
    });
});

// SUPPRIMEZ ou COMMENTEZ ces lignes qui servent les fichiers statiques :
/*
// Vérifier si le build existe
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
const fs = require('fs');

if (fs.existsSync(path.join(buildPath, 'index.html'))) {
    console.log('Le build est trouvé');
    // Servir les fichiers statiques du build React
    app.use(express.static(buildPath));
    
    // Route catch-all pour React Router
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    console.log('Le build n\'est pas trouvé, serveur API uniquement');
}
*/

// Gestion des erreurs 404 pour les routes API non trouvées
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Route API non trouvée' });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        error: 'Erreur serveur interne',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend API démarré sur le port ${PORT}`);
    console.log(`🔌 API disponible sur : http://localhost:${PORT}/api`);
    console.log(`💚 Health check : http://localhost:${PORT}/health`);
});

module.exports = app;