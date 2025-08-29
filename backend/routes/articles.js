// backend/routes/articles.js
const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');

// GET /api/articles - Récupérer tous les articles et on peut filtrer avec toutes les options donc cool
router.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      tag: req.query.tag,
      featured: req.query.featured,
      page: req.query.page,
      limit: req.query.limit
    };

    const result = await contentService.getAllArticles(filters);
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/articles/:slug - Récupérer un article spécifique grâce à son slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await contentService.getArticleBySlug(slug);
    res.json({ article });
  } catch (error) {
    if (error.message === 'Article non trouvé' || error.message === 'Article non publié') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/articles/categories/stats - Statistiques des catégories (si nécessaire, on verra)
router.get('/categories/stats', async (req, res) => {
  try {
    const categories = await contentService.getCategoryStats();
    res.json({ categories });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/articles/search/:query - Recherche d'articles (via des mots-clefs)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const results = await contentService.searchArticles(query, parseInt(page), parseInt(limit));
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/articles/:slug/like - Liker un article (à venir également)
router.post('/:slug/like', async (req, res) => {
  try {
    const { slug } = req.params;
    const likes = await contentService.incrementLikes(slug);
    res.json({ likes });
  } catch (error) {
    console.error('Erreur lors du like:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;