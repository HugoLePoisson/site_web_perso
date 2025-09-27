import React, { useState, useEffect } from 'react';
import './Article.css';
import BurgerMenu from '../components/BurgerMenu';
import { useNavigate } from 'react-router-dom';

function Article() {
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Configuration de l'URL de base de l'API pour production
    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://site-web-perso-cjp2.onrender.com/api'  // En production, utiliser le même serveur
        : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api'); // En développement

    // DEBUG : Affichez les valeurs pour comprendre le problème
    console.log('🔧 DEBUG INFO:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('API_BASE_URL final:', API_BASE_URL);
    console.log('---');

    const handleReadArticle = (slug) => {
        console.log('Navigation vers l\'article:', slug);
        navigate(`/article/${slug}`);
    };

    const fetchArticles = async (category = 'all', page = 1) => {
        try {
            setLoading(true);
            setError(null);

            // Construction de l'URL avec les paramètres
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10' // Nombre d'articles par page
            });

            if (category !== 'all') {
                params.append('category', category);
            }

            const url = `${API_BASE_URL}/articles?${params}`;
            console.log('Fetching articles from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Response is not JSON:', text);
                throw new Error('La réponse du serveur n\'est pas du JSON valide');
            }

            const data = await response.json();

            console.log('Articles data received:', data);

            setArticles(data.articles || []);
            setPagination(data.pagination);

        } catch (err) {
            console.error('Erreur lors du chargement des articles:', err);
            setError('Impossible de charger les articles. Veuillez réessayer.');

            // Fallback data
            setArticles([
                {
                    slug: "exemple-article",
                    title: "Article d'exemple",
                    excerpt: "Ceci est un article d'exemple.",
                    category: "tech",
                    date: "2025-01-15",
                    readTime: 5,
                    tags: ["Exemple"],
                    views: 0,
                    likes: 0
                }
            ]);
        } finally {
            setLoading(false);
        }
    };
    /*
    // Données tests, j'aime bien les garder car je n'ai pas encore d'API pour appeler mes données
    useEffect(() => {
        // Simulation d'un appel API
        const fetchArticles = async () => {
            // Plus tard, ceci sera : const response = await fetch('/api/articles');
            const mockArticles = [
                {
                    id: 1,
                    title: "Les tendances du développement web en 2025",
                    excerpt: "Découvrez les technologies qui vont façonner le web cette année : React Server Components, l'essor de l'IA générative...",
                    content: "Le développement web évolue rapidement. Cette année, nous voyons l'émergence de nouvelles technologies passionnantes...",
                    category: "tech",
                    date: "2025-01-15",
                    readTime: "5 min",
                    image: "/api/placeholder/400/250",
                    tags: ["React", "JavaScript", "IA"]
                },
                {
                    id: 2,
                    title: "Comment optimiser les performances de votre app React",
                    excerpt: "Techniques avancées pour rendre vos applications React plus rapides et plus efficaces.",
                    content: "L'optimisation des performances React est cruciale pour une bonne expérience utilisateur...",
                    category: "tutorial",
                    date: "2025-01-10",
                    readTime: "8 min",
                    image: "/api/placeholder/400/250",
                    tags: ["React", "Performance", "Optimisation"]
                },
                {
                    id: 3,
                    title: "Mon parcours d'ingénieur : de l'école aux projets",
                    excerpt: "Retour sur mon parcours, les défis rencontrés et les leçons apprises en tant qu'ingénieur en génie informatique.",
                    content: "Mon parcours d'ingénieur a commencé il y a plusieurs années...",
                    category: "personnel",
                    date: "2025-01-05",
                    readTime: "6 min",
                    image: "/api/placeholder/400/250",
                    tags: ["Carrière", "Ingénierie", "Expérience"]
                },
                {
                    id: 4,
                    title: "L'intelligence artificielle dans le développement",
                    excerpt: "Comment l'IA transforme la façon dont nous développons des applications et automatisons les tâches.",
                    content: "L'intelligence artificielle révolutionne notre approche du développement...",
                    category: "tech",
                    date: "2025-01-01",
                    readTime: "7 min",
                    image: "/api/placeholder/400/250",
                    tags: ["IA", "Automatisation", "Développement"]
                }
            ];

            // Simulation d'un délai de chargement
            setTimeout(() => {
                setArticles(mockArticles);
                setLoading(false);
            }, 1000);
        };

        fetchArticles();
    }, []);
    */

    // Fonction pour récupérer les statistiques des catégories
    const fetchCategories = async () => {
        try {
            const url = `${API_BASE_URL}/articles/categories/stats`;
            console.log('Fetching categories from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('La réponse du serveur n\'est pas du JSON valide');
            }

            const data = await response.json();
            setCategories(data.categories);

        } catch (err) {
            console.error('Erreur lors du chargement des catégories:', err);
            // Utiliser des catégories par défaut si l'API échoue
            setCategories([
                { id: 'all', name: 'Tous les articles', count: 0 },
                { id: 'tech', name: 'Technologie', count: 0 },
                { id: 'tutorial', name: 'Tutoriels', count: 0 },
                { id: 'personnel', name: 'Personnel', count: 0 },
                { id: 'socio', name: 'Sociologie', count: 0 }
            ]);
        }
    };

    // Fonction : Construction intelligente des URLs d'images
    const getImageUrl = (imagePath, articleTitle = "Article") => {
        const defaultPlaceholder = `https://via.placeholder.com/400x250/e2e8f0/64748b?text=${encodeURIComponent(articleTitle)}`;

        console.log('🖼️ Processing image path:', imagePath);
        console.log('🔧 Using API_BASE_URL:', API_BASE_URL);

        if (!imagePath) {
            console.log('❌ No image path, using placeholder');
            return defaultPlaceholder;
        }

        if (imagePath.startsWith('http')) {
            console.log('✅ Using full URL:', imagePath);
            return imagePath;
        }

        if (imagePath.startsWith('../images/')) {
            const filename = imagePath.replace('../images/', '');
            const apiUrl = `${API_BASE_URL}/images/${filename}`;
            console.log('🔄 Converted relative path to API URL:', apiUrl);
            return apiUrl;
        }

        if (imagePath.startsWith('/images/')) {
            const filename = imagePath.replace('/images/', '');
            const apiUrl = `${API_BASE_URL}/images/${filename}`;
            console.log('🔄 Converted /images/ path to API URL:', apiUrl);
            console.log('🔍 Final URL will be:', apiUrl);
            return apiUrl;
        }

        if (imagePath.startsWith('/')) {
            console.log('📁 Using absolute path from public:', imagePath);
            return imagePath;
        }

        const apiUrl = `${API_BASE_URL}/images/${imagePath}`;
        console.log('📄 Treating as filename, API URL:', apiUrl);
        return apiUrl;
    };

    // Fonction : Gestionnaire d'erreur d'image amélioré
    const handleImageError = (e, article) => {
        console.error('❌ Failed to load image for article:', article.title, 'Image path:', article.image);

        // Créer un placeholder personnalisé avec le titre de l'article
        const fallbackUrl = `https://via.placeholder.com/400x250/f1f5f9/475569?text=${encodeURIComponent(article.title.substring(0, 20))}`;

        // Éviter les boucles infinies
        if (e.target.src !== fallbackUrl) {
            e.target.src = fallbackUrl;
        }
    };

    // Chargement initial
    useEffect(() => {
        fetchCategories();
        fetchArticles(selectedCategory, currentPage);
        // Simulation d'un délai de chargement
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        // TEST : Vérification des URLs générées
        setTimeout(() => {
            console.log('=== TEST DES IMAGES ===');
            articles.forEach(article => {
                const imageUrl = getImageUrl(article.image, article.title, article.category);
                console.log(`📖 ${article.title}:`);
                console.log(`   Original: ${article.image}`);
                console.log(`   Final URL: ${imageUrl}`);
                console.log('---');
            });
        }, 2000);
    }, [selectedCategory, currentPage]);

    useEffect(() => {
        if (categories.length > 0) {
            fetchArticles(selectedCategory, currentPage);
        }
    }, [selectedCategory, currentPage]);

    // Gestionnaire de changement de catégorie
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset à la première page
    };

    // Gestionnaire de changement de page
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Affichage du loading
    if (loading) {
        return (
            <div className="article-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement des articles...</p>
                </div>
            </div>
        );
    }

    // Affichage des erreurs
    if (error) {
        return (
            <div className="article-page">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => fetchArticles(selectedCategory, currentPage)}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="article-page">
            <BurgerMenu />
            <div className="article-container">
                <header className="article-header">
                    <h1 className="article-page-title">Articles & Réflexions</h1>
                    <p className="article-page-description">
                        Découvrez mes <span className="highlight-gradient">réflexions</span> sur la technologie,
                        des <span className="highlight-underline">tutoriels pratiques</span> et des réflexions personnelles.
                    </p>
                    {error && (
                        <div className="api-status-warning">
                            <p>⚠️ {process.env.NODE_ENV === 'development' ? 'Mode développement - ' : ''}Données d'exemple affichées</p>
                        </div>
                    )}
                </header>

                <nav className="article-filters">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                            <span className="filter-count">({category.count})</span>
                        </button>
                    ))}
                </nav>

                <main className="articles-grid">
                    {articles.map(article => (
                        <article
                            key={article.slug}
                            className="article-card clickable-card"
                            onClick={() => handleReadArticle(article.slug)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="article-image">
                                <img
                                    src={getImageUrl(article.image, article.title)}
                                    alt={article.imageAlt || article.title}
                                    onError={(e) => handleImageError(e, article)}
                                    onLoad={() => console.log('✅ Image loaded successfully for:', article.title)}
                                />
                                <div className="article-category">{article.category}</div>
                            </div>

                            <div className="article-content">
                                <div className="article-meta">
                                    <time className="article-date">
                                        {new Date(article.date).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                    <span className="article-read-time">{article.readTime} min de lecture</span>
                                </div>

                                <h2 className="article-title">{article.title}</h2>
                                <p className="article-excerpt">{article.excerpt}</p>

                                <div className="article-tags">
                                    {article.tags && article.tags.map(tag => (
                                        <span key={tag} className="article-tag">#{tag}</span>
                                    ))}
                                </div>

                                <div className="article-footer">
                                    <button
                                        className="article-read-more"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche la propagation du clic
                                            handleReadArticle(article.slug);
                                        }}
                                    >
                                        Lire la suite
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                                        </svg>
                                    </button>

                                    <div className="article-stats">
                                        <span className="views">{article.views || 0} vues</span>
                                        <span className="likes">{article.likes || 0} ❤️</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </main>

                {articles.length === 0 && !loading && (
                    <div className="no-articles">
                        <p>Aucun article trouvé dans cette catégorie.</p>
                        <p>Les articles et leurs contenus sont hébergés sur un serveur Render gratuit. C'est une solution simple et efficace qui, pour maintenir sa gratuité, met en pause tout serveur inactif depuis 15 minutes. Si aucun article ne s'affiche, il est possible que le serveur soit en pause. Au chargement de cette page, une requête a été envoyée au serveur pour le réactiver. Vous pouvez donc recharger cette page afin de visualiser son véritable contenu. Il est possible que cela prenne une minute.</p>
                        <p>Merci et bonne lecture.</p>
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <nav className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </button>

                        <div className="pagination-info">
                            Page {pagination.currentPage} sur {pagination.totalPages}
                            ({pagination.totalArticles} articles)
                        </div>

                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                        >
                            Suivant
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}

export default Article;