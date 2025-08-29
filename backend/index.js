const express = require('express');
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
*/

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

module.exports = app;