// backend/routes/articles.js
const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');

// Debug: Route pour lister tous les slugs disponibles
router.get('/articles/debug/slugs', async (req, res) => {
    try {
        console.log('🔍 Debug: Récupération de tous les slugs...');
        const articles = await contentService.getAllArticles({ limit: 100 });
        const slugs = articles.articles.map(article => ({
            slug: article.slug,
            title: article.title,
            filename: `Probably: ${article.date}-${article.slug}.md`
        }));
        
        console.log('📋 Slugs trouvés:', slugs);
        res.json({ availableSlugs: slugs });
    } catch (error) {
        console.error('❌ Erreur debug slugs:', error);
        res.status(500).json({ error: error.message });
    }
});

// Note : Test de remonter les routes les plus spécifiques en premier pour éviter qu'elles soient interceptées par les autres

// GET /api/articles/categories/stats - Statistiques des catégories (si nécessaire, on verra)
router.get('/articles/categories/stats', async (req, res) => {
  try {
    const categories = await contentService.getCategoryStats();
    res.json({ categories });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/articles/search/:query - Recherche d'articles (via des mots-clefs)
router.get('/articles/search/:query', async (req, res) => {
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
router.post('/articles/:slug/like', async (req, res) => {
  try {
        const { slug } = req.params;
        const newLikes = await contentService.incrementLikes(slug);
        
        res.json({ success: true, likes: newLikes });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des likes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /api/articles/:slug - Récupérer un article spécifique grâce à son slug
router.get('/articles/:slug', async (req, res) => {
  try {
        const { slug } = req.params;
        const article = await contentService.getArticleBySlug(slug);
        
        res.json(article);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        
        if (error.message.includes('non trouvé') || error.message.includes('non publié')) {
            return res.status(404).json({ 
                error: 'Article non trouvé',
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Erreur serveur',
            message: 'Impossible de récupérer l\'article'
        });
    }
});

// GET /api/articles - Récupérer tous les articles et on peut filtrer avec toutes les options donc cool
router.get('/articles', async (req, res) => {
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





module.exports = router;