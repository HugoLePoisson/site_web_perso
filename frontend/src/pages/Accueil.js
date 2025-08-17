import React, { useEffect } from 'react';
import './Accueil.css';

function Accueil() {
    useEffect(() => {
        // Configuration de l'Intersection Observer
        const observerOptions = {
            threshold: 0.1, // L'animation se déclenche quand 10% de l'élément est visible
            rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
        };

        // Fonction callback qui s'exécute quand un élément devient visible
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Ajouter la classe d'animation quand l'élément devient visible
                    entry.target.classList.add('animate-in');
                } else {
                    // Optionnel : retirer la classe quand l'élément n'est plus visible
                    // (commentez cette ligne si vous voulez que l'animation ne joue qu'une fois)
                    entry.target.classList.remove('animate-in');
                }
            });
        };

        // Créer l'observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Sélectionner tous les éléments à animer
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        // Observer chaque élément
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Nettoyage lors du démontage du composant
        return () => {
            animatedElements.forEach(element => {
                observer.unobserve(element);
            });
        };
    }, []);

    return (
        <div className="accueil">
            {/* Section Accueil principale */}
            <section className="accueil-hero">
                <div className="accueil-container">
                    <h1 className="accueil-title animate-on-scroll">
                        Hugo LAFACE
                    </h1>

                    <p className="accueil-description animate-on-scroll">
                        Développeur web en formation, passionné par la création d'expériences numériques modernes et intuitives.
                    </p>

                    <div className="accueil-buttons animate-on-scroll">
                        <a
                            href="https://github.com/HugoLePoisson"
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/hugo-laface-pro/"
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </a>

                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.href = '/info'}
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </section>

            {/* Section À propos */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-content">
                        <div className="about-text animate-on-scroll">
                            <h2 className="about-title">À propos de moi</h2>

                            <p className="about-description">
                                Étudiant passionné par le développement web, je me spécialise dans la création
                                d'applications modernes avec React et Node.js. Mon parcours m'a permis de
                                développer une approche créative et technique pour résoudre des problèmes
                                complexes tout en gardant l'expérience utilisateur au cœur de mes préoccupations.
                            </p>

                            <p className="about-description">
                                Basé à Sorel-Tracy au Québec, je suis toujours à la recherche de nouveaux
                                défis et d'opportunités pour apprendre et grandir dans ce domaine en
                                constante évolution.
                            </p>

                            <a href="/info" className="about-link">
                                En savoir plus sur mon parcours →
                            </a>
                        </div>

                        <div className="about-image animate-on-scroll">
                            <div className="image-placeholder">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Accueil;