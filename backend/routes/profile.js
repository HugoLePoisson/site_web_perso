const express = require('express');
const router = express.Router();
const userData = require('../models/userData');

// Route pour le profil
router.get('/', (req, res) => {
  res.json(userData.profile);
});

// Route pour les projets
router.get('/projects', (req, res) => {
  res.json(userData.projects);
});

module.exports = router;