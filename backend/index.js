const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Utilisation des routes
app.use('/api/profile', profileRoutes);

// Route de test
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend connecté avec succès!' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});