/**
 * Home Page - Main navigation
 */
import { Link } from 'react-router-dom';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogIn } from 'lucide-react';
import myselfIcon from '@/assets/icons/homepage/homepage_button_myself.png';
import othersIcon from '@/assets/icons/homepage/homepage_button_others.png';
import trainIcon from '@/assets/icons/homepage/homepage_button_train.png';
import './Home.css';

export function Home() {
  return (
    <div className="home-page">
      <ThemeSelector />
      
      {/* Login Button - Top Left */}
      <Link to="/login" className="teacher-login-btn">
        <LogIn className="login-icon" />
        <span>Connexion</span>
      </Link>

      {/* About Us Button - Below Login */}
      <Link to="/about" className="about-us-btn">
        <span>À propos</span>
      </Link>

      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">Je te crois</h1>
        </div>

        <div className="main-options">
          <Link to="/student" className="main-option-card">
            <div className="option-icon">
              <img src={myselfIcon} alt="Get help for myself" />
            </div>
            <h2 className="option-title">Obtenir de l'aide pour moi</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/help-others" className="main-option-card">
            <div className="option-icon">
              <img src={othersIcon} alt="Help someone in need" />
            </div>
            <h2 className="option-title">Aider quelqu'un dans le besoin</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/find-out" className="main-option-card">
            <div className="option-icon">
              <img src={trainIcon} alt="Find out" />
            </div>
            <h2 className="option-title">En savoir plus</h2>
            <div className="option-arrow">→</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

