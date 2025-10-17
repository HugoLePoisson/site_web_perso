import React, { useState, useEffect } from 'react';
import './Projets.css';
import BurgerMenu from '../components/BurgerMenu';

function Projets() {
    const [expandedProject, setExpandedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Données des projets
    const projects = [
        {
            id: 1,
            title: "Site Web Personnel",
            description: "Plateforme de portfolio et blog personnel développée avec React",
            fullDescription: "Ce site web représente mon espace personnel sur internet. Développé avec React et Node.js, il centralise mes projets, articles et réflexions. Le design met l'accent sur la lisibilité avec un système de thème clair/sombre et une typographie soignée. Le backend est hébergé sur Render et gère la récupération des articles depuis des fichiers markdown.",
            technologies: ["React", "Node.js", "CSS Variables", "Markdown"],
            status: "En cours",
            link: "https://github.com/HugoLePoisson/site_web_perso",
            externalLink: true,
            date: "2025"
        },
        {
            id: 2,
            title: "Système de Gestion d'Articles",
            description: "API REST pour la gestion et l'affichage d'articles techniques",
            fullDescription: "Backend complet permettant de gérer des articles en markdown. L'API offre des endpoints pour la récupération des articles, le filtrage par catégorie, la pagination, et les statistiques. Elle intègre également un système de gestion d'images optimisé et un cache pour améliorer les performances.",
            technologies: ["Express.js", "REST API", "Markdown", "CORS"],
            status: "Terminé",
            link: "https://github.com/HugoLePoisson",
            externalLink: true,
            date: "2025"
        },
        {
            id: 3,
            title: "Projet de Recherche - INSA Lyon",
            description: "Travaux de recherche en technologies de l'information",
            fullDescription: "Durant ma formation d'ingénieur à l'INSA Lyon, j'ai participé à plusieurs projets de recherche dans le domaine des technologies de l'information. Ces projets m'ont permis d'approfondir mes connaissances en développement logiciel et en méthodologies de recherche.",
            technologies: ["Recherche", "Développement", "Innovation"],
            status: "Terminé",
            link: "#",
            externalLink: false,
            date: "2024"
        },
        {
            id: 4,
            title: "Stage à l'ÉTS Montréal",
            description: "Maîtrise en technologies de l'information",
            fullDescription: "Expérience enrichissante à l'École de Technologie Supérieure de Montréal où j'ai travaillé sur des projets innovants en technologies de l'information. Cette expérience m'a permis de développer mes compétences techniques tout en découvrant un nouvel environnement académique et culturel.",
            technologies: ["TI", "Développement", "Recherche Appliquée"],
            status: "Terminé",
            link: "#",
            externalLink: false,
            date: "2024"
        }
    ];

    useEffect(() => {
        // Simulation du chargement
        setTimeout(() => {
            setLoading(false);
        }, 500);

        // Configuration de l'Intersection Observer pour les animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        return () => {
            animatedElements.forEach(element => {
                observer.unobserve(element);
            });
        };
    }, []);

    const toggleProject = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };

    const handleProjectClick = (project, e) => {
        // Ne pas rediriger si on clique sur le bouton "En savoir plus"
        if (e.target.closest('.project-toggle-btn')) {
            return;
        }

        if (project.externalLink && project.link !== '#') {
            window.open(project.link, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className="projets-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement des projets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="projets-page">
            <BurgerMenu />
            
            <div className="projets-container">
                <header className="projets-header animate-on-scroll">
                    <h1 className="projets-page-title">Mes Projets</h1>
                    <p className="projets-page-description">
                        Découvrez les projets sur lesquels j'ai travaillé, des 
                        <span className="highlight-gradient"> applications web</span> aux 
                        <span className="highlight-gradient"> projets de recherche</span>.
                    </p>
                </header>

                <div className="projets-list">
                    {projects.map((project, index) => (
                        <article
                            key={project.id}
                            className={`project-item animate-on-scroll ${project.externalLink && project.link !== '#' ? 'clickable' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={(e) => handleProjectClick(project, e)}
                        >
                            <div className="project-header">
                                <div className="project-title-section">
                                    <h2 className="project-title">{project.title}</h2>
                                    <div className="project-meta">
                                        <span className={`project-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
                                            {project.status}
                                        </span>
                                        <span className="project-date">{project.date}</span>
                                    </div>
                                </div>
                                {project.externalLink && project.link !== '#' && (
                                    <div className="project-external-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <p className="project-description">{project.description}</p>

                            <div className="project-technologies">
                                {project.technologies.map(tech => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            <button
                                className="project-toggle-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProject(project.id);
                                }}
                                aria-expanded={expandedProject === project.id}
                            >
                                <span>En savoir plus</span>
                                <svg
                                    className={`toggle-icon ${expandedProject === project.id ? 'rotated' : ''}`}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            <div className={`project-details ${expandedProject === project.id ? 'expanded' : ''}`}>
                                <div className="project-details-content">
                                    <p className="project-full-description">{project.fullDescription}</p>
                                    {project.externalLink && project.link !== '#' && (
                                        <a
                                            href={project.link}
                                            className="project-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Voir le projet
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <section className="projets-cta animate-on-scroll">
                    <div className="cta-content">
                        <h2 className="cta-title">Vous avez un projet en tête ?</h2>
                        <p className="cta-description">
                            N'hésitez pas à me contacter pour discuter de vos idées et voir comment nous pourrions collaborer.
                        </p>
                        <button
                            className="cta-button"
                            onClick={() => window.location.href = '/info'}
                        >
                            Me contacter
                        </button>
                    </div>
                </section>
            </div>

            <footer className="footer-section">
                <div className="footer-container">
                    <p className="footer-text">
                        Ce site est développé par Hugo LAFACE •
                        <a
                            href="https://github.com/HugoLePoisson/site_web_perso"
                            className="footer-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Code source disponible sur GitHub
                        </a>
                    </p>
                    <p className="footer-year">
                        MIT License Copyright (c) 2025 HugoLePoisson
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Projets;