// backend/services/contentService.js
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter'); // Pour parser les fichiers markdown avec frontmatter

class ContentService {
  constructor() {
    this.contentDir = path.join(__dirname, '../content');
    this.articlesDir = path.join(this.contentDir, 'articles');
    this.metadataFile = path.join(this.contentDir, 'metadata', 'articles.json');
    this.imagesDir = path.join(this.contentDir, 'images');
  }

  // Lire tous les articles
  async getAllArticles(filters = {}) {
    try {
      const files = await fs.readdir(this.articlesDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      const articles = await Promise.all(
        markdownFiles.map(async (file) => {
          const article = await this.getArticleFromFile(file);
          return article;
        })
      );

      // Filtrer les articles non publiés
      let filteredArticles = articles.filter(article => article.published !== false);

      // Appliquer les filtres
      if (filters.category && filters.category !== 'all') {
        filteredArticles = filteredArticles.filter(article =>
          article.category === filters.category
        );
      }

      if (filters.tag) {
        filteredArticles = filteredArticles.filter(article =>
          article.tags && article.tags.includes(filters.tag)
        );
      }

      if (filters.featured) {
        filteredArticles = filteredArticles.filter(article =>
          article.featured === true
        );
      }

      // Trier par date (plus récent en premier)
      filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

      return {
        articles: paginatedArticles.map(article => this.getPublicArticleData(article)),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredArticles.length / limit),
          pageSize: limit,
          totalArticles: filteredArticles.length
        }
      };
    } catch (error) {
      console.error('Erreur lors de la lecture des articles:', error);
      throw error;
    }
  }

  // Lire un article spécifique par slug
  async getArticleBySlug(slug) {
    try {
      const files = await fs.readdir(this.articlesDir);
      const file = files.find(f => f.includes(slug) || f.replace('.md', '') === slug);

      if (!file) {
        throw new Error('Article non trouvé');
      }

      const article = await this.getArticleFromFile(file);

      if (article.published === false) {
        throw new Error('Article non publié');
      }

      // Incrémenter les vues
      await this.incrementViews(article.slug);

      // Récupérer des articles similaires
      const similarArticles = await this.getSimilarArticles(article);

      return {
        ...article,
        similarArticles
      };
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'article:', error);
      throw error;
    }
  }

  // Lire un fichier markdown et extraire les données
  async getArticleFromFile(filename) {
    try {
      const filePath = path.join(this.articlesDir, filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // Parser le frontmatter et le contenu
      const { data: frontmatter, content } = matter(fileContent);

      // Extraire le slug du nom de fichier
      const slug = this.extractSlugFromFilename(filename);

      // Calculer le temps de lecture
      const readTime = this.calculateReadTime(content);

      // Récupérer les métadonnées additionnelles
      const metadata = await this.getArticleMetadata(slug);

      return {
        slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content,
        category: frontmatter.category,
        tags: frontmatter.tags || [],
        date: frontmatter.date,
        published: frontmatter.published !== false,
        featured: frontmatter.featured || false,
        author: frontmatter.author || 'Hugo LAFACE',

        // Correction pour l'image - normaliser les chemins
        image: frontmatter.image?.url || frontmatter.image || null,
        imageAlt: frontmatter.image?.alt || frontmatter.title,
        imageCaption: frontmatter.image?.caption || null,

        readTime,
        views: metadata.views || 0,
        likes: metadata.likes || 0,
        seo: frontmatter.seo || {}
      };
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier ${filename}:`, error);
      throw error;
    }
  }

  // Normaliser les chemins d'images
  normalizeImagePath(imagePath) {
    if (!imagePath) return null;

    // Si c'est un objet avec une propriété url
    if (typeof imagePath === 'object' && imagePath.url) {
      imagePath = imagePath.url;
    }

    // Normaliser les chemins pour qu'ils pointent vers l'API
    if (imagePath.startsWith('/images/')) {
      // Garder tel quel, sera traité côté frontend
      return imagePath;
    }

    if (imagePath.startsWith('../images/')) {
      // Convertir en chemin absolu
      return imagePath.replace('../images/', '/images/');
    }

    // Si c'est juste un nom de fichier
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
      return `/images/${imagePath}`;
    }

    return imagePath;
  }

  // Extraire le slug du nom de fichier
  extractSlugFromFilename(filename) {
    // Format: 2025-01-15-mon-article.md -> mon-article
    return filename
      .replace('.md', '')
      .replace(/^\d{4}-\d{2}-\d{2}-/, ''); // Supprimer la date
  }

  // Calculer le temps de lecture
  calculateReadTime(content, wordsPerMinute = 200) {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Récupérer les métadonnées d'un article (vues, likes, etc.)
  async getArticleMetadata(slug) {
    try {
      const metadataContent = await fs.readFile(this.metadataFile, 'utf-8');
      const metadata = JSON.parse(metadataContent);
      return metadata[slug] || {};
    } catch (error) {
      // Si le fichier n'existe pas, créer un objet vide
      return {};
    }
  }

  // Sauvegarder les métadonnées d'un article
  async saveArticleMetadata(slug, data) {
    try {
      let metadata = {};

      try {
        const metadataContent = await fs.readFile(this.metadataFile, 'utf-8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        // Le fichier n'existe pas encore
      }

      metadata[slug] = { ...metadata[slug], ...data };

      // Créer le dossier metadata s'il n'existe pas
      await fs.mkdir(path.dirname(this.metadataFile), { recursive: true });

      await fs.writeFile(this.metadataFile, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des métadonnées:', error);
      throw error;
    }
  }

  // Incrémenter les vues d'un article
  async incrementViews(slug) {
    const metadata = await this.getArticleMetadata(slug);
    const newViews = (metadata.views || 0) + 1;
    await this.saveArticleMetadata(slug, { views: newViews });
    return newViews;
  }

  // Incrémenter les likes d'un article
  async incrementLikes(slug) {
    const metadata = await this.getArticleMetadata(slug);
    const newLikes = (metadata.likes || 0) + 1;
    await this.saveArticleMetadata(slug, { likes: newLikes });
    return newLikes;
  }

  // Récupérer des articles similaires
  async getSimilarArticles(article, limit = 3) {
    const allArticles = await this.getAllArticles();

    return allArticles.articles
      .filter(a => a.slug !== article.slug)
      .filter(a =>
        a.category === article.category ||
        (article.tags && article.tags.some(tag => a.tags && a.tags.includes(tag)))
      )
      .slice(0, limit);
  }

  // Récupérer les statistiques des catégories
  async getCategoryStats() {
    const allArticles = await this.getAllArticles({ limit: 1000 });

    const categoryCount = {};
    allArticles.articles.forEach(article => {
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });

    const categories = [
      { id: 'all', name: 'Tous les articles', count: allArticles.pagination.totalArticles },
      { id: 'tech', name: 'Technologie', count: categoryCount.tech || 0 },
      { id: 'tutorial', name: 'Tutoriels', count: categoryCount.tutorial || 0 },
      { id: 'personnel', name: 'Personnel', count: categoryCount.personnel || 0 },
      { id: 'reflexion', name: 'Réflexions', count: categoryCount.reflexion || 0 },
      { id: 'auto', name: 'Générer par IA', count: categoryCount.auto || 0 }
    ];

    return categories.filter(cat => cat.id === 'all' || cat.count > 0);
  }

  // Rechercher des articles
  async searchArticles(query, page = 1, limit = 10) {
    const allArticles = await this.getAllArticles({ limit: 1000 });

    const searchTerms = query.toLowerCase().split(' ');

    const matchedArticles = allArticles.articles.filter(article => {
      const searchableText = `${article.title} ${article.excerpt} ${article.tags?.join(' ')}`.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    // Pagination des résultats
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = matchedArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedResults,
      totalResults: matchedArticles.length,
      query
    };
  }

  // Formater les données publiques d'un article (sans le contenu complet)
  getPublicArticleData(article) {
    const { content, ...publicData } = article;
    return publicData;
  }
}

module.exports = new ContentService();