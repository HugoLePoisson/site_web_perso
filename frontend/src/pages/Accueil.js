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

        // === LOGIQUE DU CARROUSEL ===
        const initCarousel = () => {
            const track = document.querySelector('.projects-track');
            const prevBtn = document.querySelector('.nav-prev');
            const nextBtn = document.querySelector('.nav-next');
            const cards = document.querySelectorAll('.project-card');

            if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

            let currentIndex = 0;
            const cardWidth = cards[0].offsetWidth + 24; // largeur de la card + gap
            const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));

            const updateCarousel = () => {
                const translateX = -currentIndex * cardWidth;
                track.style.transform = `translateX(${translateX}px)`;

                // Gestion des états des boutons
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;
            };

            const goToPrev = () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            };

            const goToNext = () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            };

            // Event listeners
            prevBtn.addEventListener('click', goToPrev);
            nextBtn.addEventListener('click', goToNext);

            // Support du swipe tactile
            let startX = 0;
            let isDragging = false;

            const handleTouchStart = (e) => {
                startX = e.touches ? e.touches[0].clientX : e.clientX;
                isDragging = true;
            };

            const handleTouchMove = (e) => {
                if (!isDragging) return;
                e.preventDefault();
            };

            const handleTouchEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;

                const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) { // Seuil minimum pour déclencher le swipe
                    if (diff > 0) {
                        goToNext();
                    } else {
                        goToPrev();
                    }
                }
            };

            // Event listeners tactiles
            track.addEventListener('touchstart', handleTouchStart, { passive: true });
            track.addEventListener('touchmove', handleTouchMove, { passive: false });
            track.addEventListener('touchend', handleTouchEnd, { passive: true });

            // Event listeners souris
            track.addEventListener('mousedown', handleTouchStart);
            track.addEventListener('mousemove', handleTouchMove);
            track.addEventListener('mouseup', handleTouchEnd);
            track.addEventListener('mouseleave', handleTouchEnd);

            // Initialisation
            updateCarousel();

            // Redimensionnement de la fenêtre
            const handleResize = () => {
                setTimeout(() => {
                    const newCardWidth = cards[0].offsetWidth + 24;
                    const newMaxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / newCardWidth));

                    if (currentIndex > newMaxIndex) {
                        currentIndex = newMaxIndex;
                    }
                    updateCarousel();
                }, 100);
            };

            window.addEventListener('resize', handleResize);

            // Nettoyage
            return () => {
                prevBtn.removeEventListener('click', goToPrev);
                nextBtn.removeEventListener('click', goToNext);
                track.removeEventListener('touchstart', handleTouchStart);
                track.removeEventListener('touchmove', handleTouchMove);
                track.removeEventListener('touchend', handleTouchEnd);
                track.removeEventListener('mousedown', handleTouchStart);
                track.removeEventListener('mousemove', handleTouchMove);
                track.removeEventListener('mouseup', handleTouchEnd);
                track.removeEventListener('mouseleave', handleTouchEnd);
                window.removeEventListener('resize', handleResize);
            };
        };

        // Initialiser le carrousel après un court délai pour s'assurer que le DOM est prêt
        const carouselCleanup = setTimeout(() => {
            const cleanup = initCarousel();
            return cleanup;
        }, 100);

        // Nettoyage lors du démontage du composant
        return () => {
            animatedElements.forEach(element => {
                observer.unobserve(element);
            });
            clearTimeout(carouselCleanup);
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

            {/* Section Projets */}
            <section className="projects-section">
                <div className="projects-container">
                    <h2 className="projects-title animate-on-scroll">Projets du moment</h2>

                    <div className="projects-carousel animate-on-scroll">
                        <div className="projects-track">
                            {/* Projet 1 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">🌐</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Site E-commerce</h3>
                                    <p className="project-description">
                                        Application de commerce en ligne développée avec React et Node.js,
                                        incluant un système de panier et de paiement sécurisé.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">React</span>
                                        <span className="project-tag">Node.js</span>
                                        <span className="project-tag">MongoDB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 2 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">📱</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Application Mobile</h3>
                                    <p className="project-description">
                                        App mobile responsive pour la gestion de tâches,
                                        avec synchronisation temps réel et interface intuitive.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">React Native</span>
                                        <span className="project-tag">Firebase</span>
                                        <span className="project-tag">TypeScript</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 3 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">🎨</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Portfolio Créatif</h3>
                                    <p className="project-description">
                                        Site portfolio avec animations CSS avancées et design moderne,
                                        optimisé pour la performance et l'accessibilité.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">HTML/CSS</span>
                                        <span className="project-tag">JavaScript</span>
                                        <span className="project-tag">GSAP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 4 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">📊</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Dashboard Analytics</h3>
                                    <p className="project-description">
                                        Tableau de bord interactif pour visualiser des données complexes
                                        avec graphiques dynamiques et filtres en temps réel.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">Vue.js</span>
                                        <span className="project-tag">D3.js</span>
                                        <span className="project-tag">Python</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="projects-navigation">
                        <button className="nav-btn nav-prev" aria-label="Projet précédent">←</button>
                        <button className="nav-btn nav-next" aria-label="Projet suivant">→</button>
                    </div>
                </div>
            </section>

            {/* Section Contact */}
            <section className="contact-section">
                <div className="contact-container">
                    <div className="contact-content">
                        <div className="contact-text animate-on-scroll">
                            <h1 className="contact-title">Contact</h1>

                            <div className="contact-info">
                                <div className="contact-item">
                                    <div className="contact-icon">📧</div>
                                    <div className="contact-details">
                                        <h3 className="contact-label">Email</h3>
                                        <a
                                            href="mailto:hugo.laface@example.com"
                                            className="contact-link"
                                        >
                                            hugoo.laface@example.com
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">💼</div>
                                    <div className="contact-details">
                                        <h3 className="contact-label">LinkedIn</h3>
                                        <a
                                            href="https://www.linkedin.com/in/hugo-laface-pro/detail/recent-activity/shares/"
                                            className="contact-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Me contacter sur LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-visual animate-on-scroll">
                            <div className="contact-card">
                                <div className="contact-card-content">
                                    <h3 className="contact-card-title">Discutons de votre projet</h3>
                                    <p className="contact-card-text">
                                        N'hésitez pas à me contacter pour discuter de vos idées
                                        et voir comment nous pouvons les concrétiser ensemble.
                                    </p>
                                    <div className="contact-decoration">
                                        <span className="decoration-dot"></span>
                                        <span className="decoration-dot"></span>
                                        <span className="decoration-dot"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-section">
                <div className="footer-container">
                    <p className="footer-text">
                        Ce site est développé avec ❤️ par Hugo LAFACE •
                        <a
                            href="https://github.com/HugoLePoisson/mon-portfolio"
                            className="footer-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Code source disponible sur GitHub
                        </a>
                    </p>
                    <p className="footer-year">© 2025 Hugo LAFACE</p>
                </div>
            </footer>
        </div>
    );
}

export default Accueil;