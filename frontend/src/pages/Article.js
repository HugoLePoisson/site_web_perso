import React, { useState, useEffect } from 'react';
import './Article.css';
import BurgerMenu from '../components/BurgerMenu';

function Article() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Données d'exemple (à remplacer par des appels API plus tard)
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

    const filteredArticles = selectedCategory === 'all' 
        ? articles 
        : articles.filter(article => article.category === selectedCategory);

    const categories = [
        { id: 'all', name: 'Tous les articles', count: articles.length },
        { id: 'tech', name: 'Technologie', count: articles.filter(a => a.category === 'tech').length },
        { id: 'tutorial', name: 'Tutoriels', count: articles.filter(a => a.category === 'tutorial').length },
        { id: 'personnel', name: 'Personnel', count: articles.filter(a => a.category === 'personnel').length }
    ];

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

    return (
        <div className="article-page">
            <BurgerMenu />
            <div className="article-container">
                {/* Header */}
                <header className="article-header">
                    <h1 className="article-page-title">Articles & Réflexions</h1>
                    <p className="article-page-description">
                        Découvrez mes <span className="highlight-gradient">réflexions</span> sur la technologie, 
                        des <span className="highlight-underline">tutoriels pratiques</span> et mon parcours d'ingénieur.
                    </p>
                </header>

                {/* Filtres */}
                <nav className="article-filters">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                            <span className="filter-count">({category.count})</span>
                        </button>
                    ))}
                </nav>

                {/* Liste des articles */}
                <main className="articles-grid">
                    {filteredArticles.map(article => (
                        <article key={article.id} className="article-card">
                            <div className="article-image">
                                <img src={article.image} alt={article.title} />
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
                                    <span className="article-read-time">{article.readTime} de lecture</span>
                                </div>

                                <h2 className="article-title">{article.title}</h2>
                                <p className="article-excerpt">{article.excerpt}</p>

                                <div className="article-tags">
                                    {article.tags.map(tag => (
                                        <span key={tag} className="article-tag">#{tag}</span>
                                    ))}
                                </div>

                                <button className="article-read-more">
                                    Lire la suite
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                                    </svg>
                                </button>
                            </div>
                        </article>
                    ))}
                </main>

                {/* Message si aucun article */}
                {filteredArticles.length === 0 && (
                    <div className="no-articles">
                        <p>Aucun article trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Article;