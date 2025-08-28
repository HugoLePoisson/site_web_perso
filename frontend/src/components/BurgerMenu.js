import React, { useEffect, useState } from 'react';
import './BurgerMenu.css'; 

function BurgerMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Récupérer la préférence de thème sauvegardée ou utiliser le mode sombre par défaut
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme-preference');
            return saved ? saved === 'dark' : true;
        }
        return true;
    });

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
        <>
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
                    {isMenuOpen ? '↑' : '☰'}
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
                            <a href="/article" className="menu-link" onClick={closeMenu}>
                                <span className="menu-link-icon">✎</span>
                                ARTICLES
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
        </>
    );
}

export default BurgerMenu;