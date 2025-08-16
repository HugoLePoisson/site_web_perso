Pour laisser l'application react frontend en dev : npm start
Le serveur est sur http://localhost:3000

Un exemple de comment utiliser mon css : 
.ma-carte {
  background-color: var(--ui-background);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.mon-bouton {
  background-color: var(--solid-background);
  color: var(--color-1); /* Texte blanc sur fond orange */
  font-family: var(--font-title);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}

.mon-bouton:hover {
  background-color: var(--solid-background-hover);
}

Un exemple de comment switch d'un mode clair à sombre : 
// Pour basculer manuellement
document.documentElement.setAttribute('data-theme', 'dark');
// ou
document.documentElement.setAttribute('data-theme', 'light');