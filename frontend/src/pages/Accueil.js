import React from 'react';
import './Accueil.css';

function Accueil() {
    return (
        <div className="accueil">
            <div className="accueil-container">
                <h1 className="accueil-title">
                    Hugo LAFACE
                </h1>

                <p className="accueil-description">
                    Ingénieur en Génie Informatique. Animé par la créativité et la passion.
                </p>

                <div className="accueil-buttons">
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
        </div>
    );
}

export default Accueil;