import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BurgerMenu from '../components/BurgerMenu';
import './ArticleDetail.css';

function ArticleDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarArticles, setSimilarArticles] = useState([]);

    // Configuration de l'URL de base de l'API
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://site-web-perso-cjp2.onrender.com/api'
        : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

    // Fonction pour récupérer l'article complet
    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Article non trouvé');
                }
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setArticle(data);
            setSimilarArticles(data.similarArticles || []);

        } catch (err) {
            console.error('Erreur lors du chargement de l\'article:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    // Fonction pour construire l'URL des images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        
        if (imagePath.startsWith('../images/') || imagePath.startsWith('/images/')) {
            const filename = imagePath.replace('../images/', '').replace('/images/', '');
            return `${API_BASE_URL}/images/${filename}`;
        }
        
        return `${API_BASE_URL}/images/${imagePath}`;
    };

    // Composants personnalisés pour le rendu Markdown
    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        img({ src, alt, ...props }) {
            return (
                <img 
                    src={getImageUrl(src)} 
                    alt={alt} 
                    {...props}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
    };

    if (loading) {
        return (
            <div className="article-detail-page">
                <BurgerMenu />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement de l'article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="article-detail-page">
                <BurgerMenu />
                <div className="error-container">
                    <h1>Oops ! 😅</h1>
                    <p className="error-message">{error}</p>
                    <div className="error-actions">
                        <button onClick={() => navigate('/articles')} className="back-button">
                            ← Retour aux articles
                        </button>
                        <button onClick={fetchArticle} className="retry-button">
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="article-detail-page">
                <BurgerMenu />
                <div className="error-container">
                    <h1>Article non trouvé</h1>
                    <button onClick={() => navigate('/articles')} className="back-button">
                        ← Retour aux articles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="article-detail-page">
            <BurgerMenu />
            
            {/* Hero Section */}
            <header className="article-hero">
                {article.image && (
                    <div className="article-hero-image">
                        <img 
                            src={getImageUrl(article.image)} 
                            alt={article.imageAlt || article.title}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                )}
                
                <div className="article-hero-content">
                    <nav className="breadcrumb">
                        <button onClick={() => navigate('/articles')}>
                            Articles
                        </button>
                        <span>›</span>
                        <span>{article.category}</span>
                        <span>›</span>
                        <span>{article.title}</span>
                    </nav>

                    <div className="article-category-badge">{article.category}</div>
                    
                    <h1 className="article-hero-title">{article.title}</h1>
                    
                    <p className="article-hero-excerpt">{article.excerpt}</p>
                    
                    <div className="article-meta">
                        <div className="article-meta-item">
                            <span className="meta-label">Publié le</span>
                            <time>
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                        
                        <div className="article-meta-item">
                            <span className="meta-label">Temps de lecture</span>
                            <span>{article.readTime} min</span>
                        </div>
                        
                        <div className="article-meta-item">
                            <span className="meta-label">Auteur</span>
                            <span>{article.author}</span>
                        </div>
                    </div>

                    <div className="article-tags">
                        {article.tags && article.tags.map(tag => (
                            <span key={tag} className="article-tag">#{tag}</span>
                        ))}
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="article-content">
                <div className="article-body">
                    <ReactMarkdown 
                        components={markdownComponents}
                        className="markdown-content"
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>

                {/* Article Stats */}
                <div className="article-stats">
                    <span className="views">{article.views || 0} vues</span>
                    <button className="like-button">
                        ❤️ {article.likes || 0}
                    </button>
                </div>
            </main>

            {/* Similar Articles */}
            {similarArticles.length > 0 && (
                <section className="similar-articles">
                    <h2>Articles similaires</h2>
                    <div className="similar-articles-grid">
                        {similarArticles.map(similarArticle => (
                            <div 
                                key={similarArticle.slug}
                                className="similar-article-card"
                                onClick={() => navigate(`/article/${similarArticle.slug}`)}
                            >
                                <img 
                                    src={getImageUrl(similarArticle.image)} 
                                    alt={similarArticle.title}
                                    onError={(e) => {
                                        e.target.src = `https://via.placeholder.com/300x200/e2e8f0/64748b?text=${encodeURIComponent(similarArticle.title)}`;
                                    }}
                                />
                                <div className="similar-article-content">
                                    <h3>{similarArticle.title}</h3>
                                    <p>{similarArticle.excerpt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ArticleDetail;