/**
 * Home Page - Main navigation
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogIn } from 'lucide-react';

import myselfIcon from '@/assets/icons/homepage/homepage_button_myself.png';
import othersIcon from '@/assets/icons/homepage/homepage_button_others.png';
import trainIcon from '@/assets/icons/homepage/homepage_button_train.png';

// 👇 Make sure this path matches where your GIF actually is
import loadingGif from '@/assets/gifs/loading.gif';

import './Home.css';

// 🔴 Module-level flag: survives route changes, resets only on full page reload
let hasShownHomeLoader = false;

export function Home() {
  // If we've already shown the loader once in this tab, start directly with no loading
  const [isLoading, setIsLoading] = useState(!hasShownHomeLoader);

  useEffect(() => {
    // If loader was already shown in this tab, do nothing
    if (hasShownHomeLoader) {
      return;
    }

    // First time: show loader, then hide after delay and remember it was shown
    const timer = setTimeout(() => {
      setIsLoading(false);
      hasShownHomeLoader = true;
    }, 3600); // 3.6s

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      {/* FULLSCREEN LOADING OVERLAY */}
      {isLoading && (
        <div className="home-loading-overlay">
          <div className="loading-content">
            <h1 className="home-title">Je te crois</h1>
            <img src={loadingGif} alt="Loading…" className="loading-gif" />
            <p className="loading-text">Accroche-toi... Les secours arrivent</p>
            <p className="loading-text">Hang in there... Help is arriving</p>
          </div>
        </div>
      )}

      <ThemeSelector />

      {/* Teacher Login Button - Top Left */}
      <Link to="/teacher" className="teacher-login-btn">
        <LogIn className="login-icon" />
        <span>Teacher Login</span>
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
            <h2 className="option-title">Get help for myself</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/help-others" className="main-option-card">
            <div className="option-icon">
              <img src={othersIcon} alt="Help someone in need" />
            </div>
            <h2 className="option-title">Help someone in need</h2>
            <div className="option-arrow">→</div>
          </Link>

          <Link to="/find-out" className="main-option-card">
            <div className="option-icon">
              <img src={trainIcon} alt="Find out" />
            </div>
            <h2 className="option-title">Find out</h2>
            <div className="option-arrow">→</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
