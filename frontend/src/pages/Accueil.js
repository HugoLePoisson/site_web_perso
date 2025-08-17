import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css';

function Accueil() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Récupérer la préférence de thème sauvegardée ou utiliser le mode sombre par défaut
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme-preference');
            return saved ? saved === 'dark' : true;
        }
        return true;
    });

    // Fonction pour scroller vers la section contact
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

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
    }, [isMenuOpen, isDarkMode]);

    // Appliquer le thème quand isDarkMode change
    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme-preference', theme);
    }, [isDarkMode]);

    // === FONCTIONS DU MENU ===
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="accueil">
            {/* Overlay pour fermer le menu */}
            {isMenuOpen && (
                <div
                    className="menu-overlay"
                    onClick={closeMenu}
                    aria-hidden="true"
                ></div>
            )}

            {/* Bouton Menu */}
            <button
                className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMenuOpen}
            >
                <span className="menu-toggle-icon">
                    {isMenuOpen ? '←' : '☰'}
                </span>
            </button>

            {/* Menu latéral */}
            <nav className={`side-menu ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="menu-content">
                    <div className="menu-divider"></div>
                    <div className="theme-toggle-section">
                        <button
                            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
                            onClick={toggleTheme}
                            aria-label={`Passer en mode ${isDarkMode ? 'clair' : 'sombre'}`}
                        >
                            <span className="theme-toggle-track">
                                <span className="theme-toggle-thumb">
                                    {isDarkMode ? '☾' : '☀'}
                                </span>
                            </span>
                            <span className="theme-label">
                                {isDarkMode ? 'Mode sombre' : 'Mode clair'}
                            </span>
                        </button>
                    </div>
                    <div className="menu-divider"></div>
                    <h1 className="menu-title">Menu</h1>
                    <ul className="menu-links">
                        <li>
                            <a href="/" className="menu-link" onClick={closeMenu}>
                                <span className="menu-link-icon">⌂</span>
                                ACCUEIL
                            </a>
                        </li>
                        <li>
                            <a href="/info" className="menu-link" onClick={closeMenu}>
                                <span className="menu-link-icon">ℹ</span>
                                À PROPOS
                            </a>
                        </li>
                        <li>
                            <a href="/projets" className="menu-link" onClick={closeMenu}>
                                <span className="menu-link-icon">⚙</span>
                                PROJETS
                            </a>
                        </li>
                        <li>
                            <a href="/info" className="menu-link" onClick={closeMenu}>
                                <span className="menu-link-icon">✆</span>
                                CONTACT
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* Section Accueil principale */}
            <section className="accueil-hero">
                <div className="accueil-container">
                    <h1 className="accueil-title animate-on-scroll">
                        Hugo LAFACE
                    </h1>

                    <p className="accueil-description animate-on-scroll">
                        Ingénieur de formation, passionné par l'innovation et la réalisation de projets modernes et intuitifs.
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
                                Récemment diplômé du cursus d'ingénieur de l'INSA Lyon et de la maîtrise en technologies de l'information de l'École de Technologie Supérieure de Montréal.
                                J'aime <span className="highlight-gradient">imaginer</span>, <span className="highlight-gradient">concevoir</span>, <span className="highlight-gradient">résoudre</span>, <span className="highlight-gradient">apprendre</span> et <span className="highlight-gradient">enseigner</span>.
                                Je vois cet espace comme un moyen de centraliser mes projets mais également mes pensées et diverses idées.
                                C'est avec plaisir que je partage donc cela avec quiconque visite cet site internet. N'hésitez pas à me partager vos questionnements, propositions d'améliorations constructives ou quelconques remarques !

                                Au plaisir,
                                Hugo
                            </p>

                            <p className="about-description">
                                Basé à Montréal au Québec, je suis toujours à la recherche de nouveaux
                                défis et d'opportunités.
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
                                        <span className="project-icon">-</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Projet à venir</h3>
                                    <p className="project-description">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Lorem ipsum dolor sit amet.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">Tag 1</span>
                                        <span className="project-tag">Tag 2</span>
                                        <span className="project-tag">Tag 3</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 2 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">-</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Projet à venir</h3>
                                    <p className="project-description">
                                        Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">Tag 1</span>
                                        <span className="project-tag">Tag 2</span>
                                        <span className="project-tag">Tag 3</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 3 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">-</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Projet à venir</h3>
                                    <p className="project-description">
                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">Tag 1</span>
                                        <span className="project-tag">Tag 2</span>
                                        <span className="project-tag">Tag 3</span>
                                    </div>
                                </div>
                            </div>

                            {/* Projet 4 */}
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-image-placeholder">
                                        <span className="project-icon">-</span>
                                    </div>
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">Projet à venir</h3>
                                    <p className="project-description">
                                        It is a long established fact that a reader will be distracted by the readable content. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                                    </p>
                                    <div className="project-tags">
                                        <span className="project-tag">Tag 1</span>
                                        <span className="project-tag">Tag 2</span>
                                        <span className="project-tag">Tag 3</span>
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
                                    <div className="contact-icon">@</div>
                                    <div className="contact-details">
                                        <h2 className="contact-label">Email</h2>
                                        <a
                                            href="mailto:hugo.laface@example.com"
                                            className="contact-link"
                                        >
                                            hugoo.laface@example.com
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">In</div>
                                    <div className="contact-details">
                                        <h2 className="contact-label">LinkedIn</h2>
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
                                    <h2 className="contact-card-title">Discutons ensemble</h2>
                                    <p className="contact-card-text">
                                        N'hésitez pas à me contacter si vous avez des questions ou simplement pour discuter.
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
                    <p className="footer-year">MIT License
                        Copyright (c) 2025 HugoLePoisson</p>
                </div>
            </footer>
        </div>
    );
}

export default Accueil;