/**
 * About Us Page - Information about Je Te Crois
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ArasaacPicto } from '../../components/ui/ArasaacPicto';
import './AboutUs.css';

export function AboutUs() {
  useEffect(() => {
    // Charger le script Fillout
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage
      document.body.removeChild(script);
    };
  }, []);
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
            <div className="hero-image">
              <ArasaacPicto id={20401} size="100%" alt="Je te crois" className="hero-logo" />
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Je te crois</h1>
              <h2 className="hero-subtitle">Signaler le harcèlement pour les élèves en situation de handicap verbal</h2>
              <Link to="/teacher" className="cta-primary">
                Essayer
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Target Audience Section */}
          <section className="audience-section">
            <h2 className="section-title">Conçu pour les élèves vulnérables</h2>
            <div className="audience-grid">
              <div className="audience-card">
                <ArasaacPicto id={37444} align="center" size="50%" alt="Enfant autistique" className="audience-icon" />
                <h3>Élèves autistiques harcelés</h3>
                <p>Une interface adaptée pour faciliter l'expression</p>
              </div>
              <div className="audience-card">
              <ArasaacPicto id={32558} align="center" size="50%" alt="Enfant autistique" className="audience-icon" />
              <h3>Élèves dyslexiques</h3>
                <p>Communication visuelle pour surmonter les difficultés de lecture</p>
              </div>
              <div className="audience-card">
              <ArasaacPicto id={8173} align="center" size="50%" alt="Enfant autistique" className="audience-icon" />
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
                  <img src="/screenshot_home.png"  alt="Signalement" className="workflow-icon" />
                  <p>L'élève veut faire un signalement.</p>

                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Questions visuelles</h3>
                  <img src="/screenshot_type.png"  alt="Signalement" className="workflow-icon" />

                  <p>L'application pose des questions visuelles (librairie AAC).</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Questions visuelles</h3>
                  <img src="/screenshot_type.png"  alt="Signalement" className="workflow-icon" />

                  <p>L'application pose des questions visuelles (librairie AAC).</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Précisions</h3>
                  <img src="/screenshot_bodypart.png"  alt="Signalement" className="workflow-icon" />

                  <p>L'élève peut préciser par le visuel.</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              

              <div className="workflow-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>Confirmation</h3>
                  <img src="/screenshot_report_review.png"  alt="Signalement" className="workflow-icon" />

                  <p>L'élève confirme le signalement.</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              
              <div className="workflow-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h3>Envoi</h3>
                  <img src="/screenshot_teacher_dashboard.png"  alt="Signalement" className="workflow-icon" />

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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <img src="https://static.arasaac.org/pictograms/27685/27685_500.png" alt="AAC icon" width="150" height="150" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0 }}>
                    Je te crois utilise des pictogrammes ARASAAC pour permettre aux élèves de 
                    s'exprimer facilement.
                    <br />
                    <br />
                    En savoir plus sur le site de l'ARASAAC{' '}
                    <a
                      href="https://arasaac.org/fr/aac"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2596be',
                        textDecoration: 'underline',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = '#46afde')}
                      onMouseOut={e => (e.currentTarget.style.color = '#2596be')}
                    >
                      ici
                    </a>
                  </p>
                </div>
     
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
          <div 
            style={{width: '100%', height: '500px'}} 
            data-fillout-id="imjudugNyGus" 
            data-fillout-embed-type="standard" 
            data-fillout-inherit-parameters 
            data-fillout-dynamic-resize
          ></div>
        </footer>
      </div>
    </div>
  );
}
