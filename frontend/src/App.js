import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Accueil from './pages/Accueil';
import Blog from './pages/Blog';
import Info from './pages/Info';
import Projets from './pages/Projets';
import './App.css';

function App() {
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
            {/* Route 404 */}
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;