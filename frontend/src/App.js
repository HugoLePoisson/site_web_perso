import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Accueil from './pages/Accueil';
import Blog from './pages/Blog';
import Info from './pages/Info';
import Projets from './pages/Projets';
import Article from './pages/Article';
import ArticleDetail from './pages/ArticleDetail';
import './App.css';

function App() {
  useEffect(() => {
    // Fonction pour envoyer un ping au backend
    const pingBackend = () => {
      fetch('https://site-web-perso-cjp2.onrender.com/api/ping')
        .then(response => response.json())
        .then(data => console.log('Ping envoyé :', data))
        .catch(error => console.error('Erreur lors du ping :', error));
    };

    // Appel initial
    pingBackend();

    // Appel toutes les 5 minutes (300 000 ms)
    const interval = setInterval(pingBackend, 300000);

    // Nettoyage de l'intervalle si le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Menu hamburger latéral */}
        <SideMenu />
        {/* Contenu qui change selon l'URL */}
        <main>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/info" element={<Info />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/article" element={<Article />} />
            <Route path="/articles" element={<Article />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            {/* Route 404 */}
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
