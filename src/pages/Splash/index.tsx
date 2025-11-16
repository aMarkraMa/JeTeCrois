import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from '@/assets/gifs/loading.gif';
import './Splash.css';

export function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const navTimer = setTimeout(() => {
      navigate('/'); 
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img src={loadingGif} alt="Loading..." className="splash-gif" />
        <h1 className="splash-title">Are You Safe</h1>
        <p className="splash-subtitle">Je te crois</p>
      </div>
    </div>
  );
}
