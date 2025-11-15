/**
 * Home Page - Main navigation
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogIn } from 'lucide-react';
import myselfIcon from '@/assets/icons/homepage/homepage_button_myself.png';
import othersIcon from '@/assets/icons/homepage/homepage_button_others.png';
import trainIcon from '@/assets/icons/homepage/homepage_button_train.png';
import './Home.css';

export function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div className="home-page">
      <div className="top-controls">
        <ThemeSelector />
      </div>

      {/* Login Button - Top Left */}
      <Link to="/login" className="teacher-login-btn">
        <LogIn className="login-icon" />
        <span>{t('home.login')}</span>
      </Link>

      {/* Language Switcher - Below Login Button */}
      <div className="language-switcher-container">
        <button
          onClick={() => {
            const newLang = i18n.language === 'fr' ? 'en' : 'fr';
            i18n.changeLanguage(newLang);
          }}
          className="language-switcher-btn"
          aria-label={`Switch to ${i18n.language === 'fr' ? 'English' : 'French'}`}
        >
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">{t('home.title')}</h1>
          <p className="home-subtitle">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="main-options">
          <Link to="/student" className="main-option-card">
            <div className="option-icon">
              <img src={myselfIcon} alt={t('home.getHelpForMyself')} />
            </div>
            <h2 className="option-title">{t('home.getHelpForMyself')}</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/help-others" className="main-option-card">
            <div className="option-icon">
              <img src={othersIcon} alt={t('home.helpSomeoneInNeed')} />
            </div>
            <h2 className="option-title">{t('home.helpSomeoneInNeed')}</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/find-out" className="main-option-card">
            <div className="option-icon">
              <img src={trainIcon} alt={t('home.findOut')} />
            </div>
            <h2 className="option-title">{t('home.findOut')}</h2>
            <div className="option-arrow">→</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
