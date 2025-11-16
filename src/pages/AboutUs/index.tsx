/**
 * About Us Page - Information about Je Te Crois
 */
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AboutUs.css';

export function AboutUs() {
  return (
    <div className="aboutus-page">
      {/* Back Button */}
      <Link to="/home" className="back-btn">
        <ArrowLeft className="back-icon" />
        <span>Retour</span>
      </Link>

      <div className="jetecrois-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Je te crois</h1>
            <h2 className="hero-subtitle">Signalement du harcèlement scolaire</h2>
            <p className="slogan">Signaler le harcèlement pour les élèves vulnérables.</p>
            <Link to="/student" className="cta-primary">
              Essayez maintenant
            </Link>
          </div>
        </header>

        <main>
          {/* Target Audience Section */}
          <section className="audience-section">
            <h2 className="section-title">Conçu pour les élèves vulnérables</h2>
            <div className="audience-grid">
              <div className="audience-card">
                <div className="audience-icon">👥</div>
                <h3>Élèves autistiques harcelés</h3>
                <p>Une interface adaptée pour faciliter l'expression</p>
              </div>
              <div className="audience-card">
                <div className="audience-icon">📖</div>
                <h3>Élèves dyslexiques</h3>
                <p>Communication visuelle pour surmonter les difficultés de lecture</p>
              </div>
              <div className="audience-card">
                <div className="audience-icon">🌍</div>
                <h3>Élèves non francophones</h3>
                <p>Pictogrammes universels pour une communication sans barrière linguistique</p>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section className="workflow-section">
            <h2 className="section-title">Comment ça marche ?</h2>
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Signalement</h3>
                  <p>L'élève veut faire un signalement.</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Questions visuelles</h3>
                  <p>L'application pose des questions visuelles (librairie AAC).</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Confirmation</h3>
                  <p>L'élève confirme le signalement.</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Envoi</h3>
                  <p>Le signalement est envoyé au responsable d'établissement.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="features-section">
            <h2 className="section-title">Notre Solution Unique</h2>
            
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-content">
                <h3>Autonomie et Sécurité</h3>
                <p>
                  Je te crois est la seule solution qui permet aux élèves en situation de 
                  handicap verbal de signaler le harcèlement de manière autonome et sécurisée.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-content">
                <h3>Basé sur la Communication Améliorée et Alternative (AAC)</h3>
                <p>
                  Je te crois utilise des pictogrammes AAC pour permettre aux élèves de 
                  s'exprimer facilement.
                </p>
                <div className="aac-definition">
                  <strong>Qu'est-ce que l'AAC ?</strong>
                  <p>
                    La Communication Améliorée et Alternative (AAC) est une méthode de 
                    communication utilisée par les personnes ayant des difficultés à parler.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Call to Action Footer */}
        <footer className="footer-cta">
          <h2>Prêt à faire la différence ?</h2>
          <p>Rejoignez-nous dans la lutte contre le harcèlement scolaire.</p>
          <Link to="/student" className="cta-secondary">
            Essayez maintenant
          </Link>
        </footer>
      </div>
    </div>
  );
}
