/**
 * Student Dashboard - Visual reporting interface
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, logout } from '@/lib/auth';
import { CategorySymbolSelector } from '@/components/reporting/CategorySymbolSelector';
import { BodyMap } from '@/components/reporting/BodyMap';
import { EmotionScaleComponent } from '@/components/reporting/EmotionScale';
import { SafetyThermometerComponent } from '@/components/reporting/SafetyThermometer';
import { Button } from '@/components/ui/button';
// Question icons
import howAreYouIcon from '@/assets/icons/questions/How_u_feel.png';
import whereIcon from '@/assets/icons/questions/where.png';
import howOftenIcon from '@/assets/icons/questions/How_offen.png';
import whichBodyPartIcon from '@/assets/icons/questions/Which_body_part.png';
// Category type icons
import attackIcon from '@/assets/icons/types/attack.png';
import mockIcon from '@/assets/icons/types/mock.png';
import isolationIcon from '@/assets/icons/types/isolation.png';
import {
  createReport,
  getLocations,
  type Location,
  type SymbolSelection,
  type BodyMapSelection,
  type EmotionScale,
  type Frequency,
  type SafetyThermometer,
} from '@/lib/api';
import './StudentDashboard.css';

const frequencyOptions = [
  { value: 'once', label: 'Une fois' },
  { value: 'sometimes', label: 'Parfois' },
  { value: 'often', label: 'Souvent' },
  { value: 'always', label: 'Toujours' },
];

// Category configuration for step-by-step symbol selection
const SYMBOL_CATEGORIES = [
  { id: 'physical', label: 'Harcèlement physique', icon: attackIcon },
  { id: 'verbal', label: 'Harcèlement verbal', icon: mockIcon },
  { id: 'social', label: 'Harcèlement social', icon: isolationIcon },
  { id: 'cyber', label: 'Cyber-harcèlement', icon: '💻' }, // No icon file for cyber, keep emoji
];

export function StudentDashboard() {
  const [step, setStep] = useState(1);
  const currentUser = getCurrentUser();
  const studentId = currentUser?.id || 'student-001';
  const studentName = currentUser?.name || 'Student';
  
  const [isEverythingFine, setIsEverythingFine] = useState<boolean | null>(null);
  const [wasEverythingFine, setWasEverythingFine] = useState<boolean>(false);
  const [symbols, setSymbols] = useState<SymbolSelection[]>([]);
  const [categorySelections, setCategorySelections] = useState<Record<string, SymbolSelection[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [physicalMethods, setPhysicalMethods] = useState<string[]>([]);
  const [bodyMap, setBodyMap] = useState<BodyMapSelection[]>([]);
  const [emotion, setEmotion] = useState<EmotionScale | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [safety, setSafety] = useState<SafetyThermometer | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  // Keep step valid when selection changes (e.g., physical deselected while on physical step)
  useEffect(() => {
    if (isEverythingFine === false) {
      const steps = getVisibleSteps();
      if (!steps.includes(step)) {
        // Move to the nearest valid step (prefer next logical)
        const posAfterRemoval = steps.find((s) => s > step) ?? steps[steps.length - 1];
        setStep(posAfterRemoval);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEverythingFine, selectedCategories]);

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
      return data;
    } catch (error) {
      console.error('Error loading locations:', error);
      return [];
    }
  };

  // Compute the visible steps dynamically to avoid gaps and empty screens
  const getVisibleSteps = () => {
    if (isEverythingFine === null) return [1];
    if (isEverythingFine === true) return [1]; // Auto-submit path handled separately
    // isEverythingFine === false
    const base = [1, 2];
    if (selectedCategories.includes('physical')) {
      base.push(3);
    }
    // 6 review, 7 emotion, 8 location, 9 frequency, 10 safety
    base.push(6, 7, 8, 9, 10);
    return base;
  };

  const visibleSteps = getVisibleSteps();
  const currentPos = visibleSteps.indexOf(step);

  const handleSubmit = async () => {
    // Normal submission flow (only called when reporting something)
    if (!symbols.length) {
      alert('Veuillez sélectionner au moins un incident à signaler');
      return;
    }
    if (!emotion || !location || !frequency || !safety) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        studentId,
        studentName,
        symbols,
        bodyMap: bodyMap.length > 0 ? bodyMap : undefined,
        emotion,
        location,
        frequency,
        safety,
      });
      setSubmitSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Erreur lors de l\'envoi du signalement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsEverythingFine(null);
    setWasEverythingFine(false);
    setSymbols([]);
    setCategorySelections({});
    setSelectedCategories([]);
    setPhysicalMethods([]);
    setBodyMap([]);
    setEmotion(null);
    setLocation(null);
    setFrequency(null);
    setSafety(null);
    setSubmitSuccess(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return isEverythingFine !== null;
      case 2:
        return selectedCategories.length > 0;
      case 3:
        if (selectedCategories.includes('physical')) {
          return bodyMap.length > 0 && physicalMethods.length > 0;
        }
        return true;
      case 4:
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return emotion !== null;
      case 8:
        return location !== null;
      case 9:
        return frequency !== null;
      case 10:
        return safety !== null;
      case 11:
        return true;
      default:
        return false;
    }
  };

  const handleCategorySelection = (category: string, selected: SymbolSelection[]) => {
    setCategorySelections((prev) => {
      const updated = {
        ...prev,
        [category]: selected,
      };
      const allSymbols = Object.values(updated).flat();
      setSymbols(allSymbols);
      return updated;
    });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(categoryId);
      const next = exists ? prev.filter((c) => c !== categoryId) : [...prev, categoryId];
      // Build symbols: include non-physical category markers + physical methods if physical chosen
      const nonPhysicalSymbols: SymbolSelection[] = next
        .filter((c) => c !== 'physical')
        .map((c) => {
          const meta = SYMBOL_CATEGORIES.find((x) => x.id === c);
          return {
            id: `category_${c}`,
            label: meta?.label || c,
            category: c,
          };
        });
      const physicalSymbols: SymbolSelection[] = next.includes('physical')
        ? physicalMethods.map((m) => ({
            id: `physical_${m}`,
            label: m === 'pousser' ? 'pousser' : m === 'frapper' ? 'frapper' : 'donner un coup de pied',
            category: 'physical',
          }))
        : [];
      setSymbols([...physicalSymbols, ...nonPhysicalSymbols]);
      if (!next.includes('physical')) {
        setPhysicalMethods([]);
        setBodyMap([]);
      }
      return next;
    });
  };

  const togglePhysicalMethod = (methodId: string) => {
    setPhysicalMethods((prev) => {
      const exists = prev.includes(methodId);
      const next = exists ? prev.filter((m) => m !== methodId) : [...prev, methodId];
      const physicalSymbols: SymbolSelection[] = selectedCategories.includes('physical')
        ? next.map((m) => ({
            id: `physical_${m}`,
            label: m === 'pousser' ? 'pousser' : m === 'frapper' ? 'frapper' : 'donner un coup de pied',
            category: 'physical',
          }))
        : [];
      const nonPhysicalSymbols: SymbolSelection[] = selectedCategories
        .filter((c) => c !== 'physical')
        .map((c) => {
          const meta = SYMBOL_CATEGORIES.find((x) => x.id === c);
          return {
            id: `category_${c}`,
            label: meta?.label || c,
            category: c,
          };
        });
      setSymbols([...physicalSymbols, ...nonPhysicalSymbols]);
      return next;
    });
  };

  const handleNext = () => {
    const steps = visibleSteps;
    const pos = steps.indexOf(step);
    if (pos >= 0 && pos < steps.length - 1) {
      setStep(steps[pos + 1]);
    }
  };
  const handlePrev = () => {
    const steps = visibleSteps;
    const pos = steps.indexOf(step);
    if (pos > 0) {
      setStep(steps[pos - 1]);
    }
  };

  const handleEverythingFine = async (value: boolean) => {
    setIsEverythingFine(value);
    if (value === true) {
      setWasEverythingFine(true);
      setIsSubmitting(true);
      try {
        let locationsData = locations;
        if (locationsData.length === 0) {
          locationsData = await loadLocations();
        }
        
        const defaultLocation = locationsData.length > 0 ? locationsData[0] : {
          id: 'general',
          name: 'General',
          icon: '🏫'
        };
        
        await createReport({
          studentId,
          studentName,
          symbols: [{ id: 'everything_fine', label: 'Everything is fine', category: 'general' }],
          bodyMap: undefined,
          emotion: { level: 1, color: 'green' },
          location: defaultLocation,
          frequency: { value: 'once' },
          safety: { level: 1, feeling: 'very_safe' },
        });
        setSubmitSuccess(true);
        setTimeout(() => {
          resetForm();
        }, 3000);
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('Error sending report. Please try again.');
        setIsSubmitting(false);
        setWasEverythingFine(false);
      }
    } else {
      setStep(2);
    }
  };

  if (submitSuccess) {
    return (
      <div className="student-dashboard">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Signalement envoyé avec succès</h2>
          <p>
            {wasEverythingFine
              ? "Merci de nous avoir fait savoir que tout va bien. Votre signalement a été reçu."
              : "Votre signalement a été reçu. Un enseignant l'examinera bientôt."}
          </p>
          <div className="success-actions">
            <Link to="/">
              <Button variant="outline" className="previous-btn">
                Retour à l'accueil
              </Button>
            </Link>
            <Button onClick={resetForm} className="next-btn">
              Créer un nouveau signalement
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      <div className="dashboard-header-top">
        <Link to="/" className="dashboard-title-link">
          <h1 className="dashboard-title">Je te crois</h1>
        </Link>
        <div className="user-info">
          <span className="user-name">{studentName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="logout-btn"
          >
            Déconnexion
          </Button>
        </div>
      </div>

      {isEverythingFine === false && (
        <div className="progress-bar">
          <div className="progress-steps">
            {visibleSteps.map((_, idx) => (
              <div
                key={idx}
                className={`progress-step ${idx <= currentPos ? 'active' : ''} ${idx === currentPos ? 'current' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="report-form">
        {step === 1 && (
          <div className="form-step">
            <div className="question-header">
              <img src={howAreYouIcon} alt="How are you doing" className="question-icon" />
              <h3>Comment te sens-tu aujourd'hui ?</h3>
            </div>
            <div className="everything-fine-options">
              <button
                onClick={() => handleEverythingFine(false)}
                className={`everything-fine-btn ${isEverythingFine === false ? 'selected' : ''}`}
              >
                <div className="fine-icon">⚠️</div>
                <div className="fine-content">
                  <h4 className="fine-title">J'ai besoin de signaler quelque chose</h4>
                  <p className="fine-description">Quelque chose s'est passé que je veux signaler</p>
                </div>
              </button>
              <button
                onClick={() => handleEverythingFine(true)}
                className={`everything-fine-btn everything-fine-subtle ${isEverythingFine === true ? 'selected' : ''}`}
              >
                <div className="fine-icon">✅</div>
                <div className="fine-content">
                  <h4 className="fine-title">Tout va bien</h4>
                  <p className="fine-description">Aucun incident à signaler</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose main category (Corps/Physical, Langage/Verbal, Social, Cyber) - multi-select */}
        {isEverythingFine === false && step === 2 && (
          <div className="form-step">
            <div className="question-header">
              <div className="question-icon-placeholder">🧭</div>
              <h3>Quel type ? Corps, Langage, Social, ou Cyber ?</h3>
            </div>
            <div className="locations-grid">
              {SYMBOL_CATEGORIES.map((cat) => {
                const isImageIcon =
                  typeof cat.icon === 'string' &&
                  (cat.icon.includes('/') || cat.icon.includes('\\') || cat.icon.endsWith('.png'));
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`location-card ${selectedCategories.includes(cat.id) ? 'selected' : ''}`}
                  >
                    <span className="location-icon">
                      {isImageIcon ? <img src={cat.icon as any} alt={cat.label} className="symbol-category-badge-image" /> : cat.icon}
                    </span>
                    <span className="location-name">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: If physical -> choose body part and attack methods */}
        {isEverythingFine === false && step === 3 && selectedCategories.includes('physical') && (
          <div className="form-step">
            <div className="question-header">
              <img src={whichBodyPartIcon} alt="Which body part" className="question-icon" />
              <h3>Quelle partie du corps a été touchée ?</h3>
            </div>
            <BodyMap onSelect={setBodyMap} selectedPoints={bodyMap} />
            <div className="question-header" style={{ marginTop: 24 }}>
              <div className="question-icon-placeholder">🥊</div>
              <h3>Comment as-tu été attaqué·e ?</h3>
            </div>
            <div className="frequency-options">
              {[
                { id: 'pousser', label: 'pousser' },
                { id: 'frapper', label: 'frapper' },
                { id: 'donner_un_coup_de_pied', label: 'donner un coup de pied' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => togglePhysicalMethod(m.id)}
                  className={`frequency-btn ${physicalMethods.includes(m.id) ? 'selected' : ''}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Summary/Review */}
        {isEverythingFine === false && step === 6 && (
          <div className="form-step">
            <div className="question-header">
              <div className="question-icon-placeholder">📋</div>
              <h3>Révision de ton signalement</h3>
            </div>
            <div className="review-summary">
              <p>Tu as sélectionné les incidents suivants :</p>
              {symbols.length > 0 ? (
                <div className="selected-symbols-list">
                  {symbols.map((symbol) => {
                    const category = SYMBOL_CATEGORIES.find(c => c.id === symbol.category);
                    const categoryIcon = category?.icon;
                    const isImageIcon = typeof categoryIcon === 'string' && 
                      (categoryIcon.includes('/') || categoryIcon.includes('\\') || categoryIcon.endsWith('.png'));
                    return (
                      <div key={symbol.id} className="selected-symbol-item">
                        <span className="symbol-category-badge">
                          {isImageIcon ? (
                            <img src={categoryIcon} alt={category?.label || ''} className="symbol-category-badge-image" />
                          ) : (
                            categoryIcon
                          )}
                        </span>
                        <span className="symbol-label-text">{symbol.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#FF8CC8', fontStyle: 'italic' }}>Aucun incident sélectionné. Tu peux revenir en arrière pour ajouter des incidents.</p>
              )}
            </div>
          </div>
        )}

        {isEverythingFine === false && step === 7 && (
          <div className="form-step">
            <EmotionScaleComponent onSelect={setEmotion} selectedEmotion={emotion || undefined} />
          </div>
        )}

        {isEverythingFine === false && step === 8 && (
          <div className="form-step">
            <div className="question-header">
              <img src={whereIcon} alt="Where" className="question-icon" />
              <h3>Où cela s'est-il passé ?</h3>
            </div>
            <div className="locations-grid">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setLocation(loc)}
                  className={`location-card ${location?.id === loc.id ? 'selected' : ''}`}
                >
                  <span className="location-icon">{loc.icon}</span>
                  <span className="location-name">{loc.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isEverythingFine === false && step === 9 && (
          <div className="form-step">
            <div className="question-header">
              <img src={howOftenIcon} alt="How often" className="question-icon" />
              <h3 id="frequency-question">À quelle fréquence cela se produit-il ?</h3>
            </div>
            <div className="frequency-slider">
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={
                  frequency?.value === 'always'
                    ? 3
                    : frequency?.value === 'often'
                    ? 2
                    : frequency?.value === 'sometimes'
                    ? 1
                    : 0
                }
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const val = idx === 3 ? 'always' : idx === 2 ? 'often' : idx === 1 ? 'sometimes' : 'once';
                  setFrequency({ value: val });
                }}
                className={`frequency-slider-input ${
                  frequency?.value === 'always'
                    ? 'freq-3'
                    : frequency?.value === 'often'
                    ? 'freq-2'
                    : frequency?.value === 'sometimes'
                    ? 'freq-1'
                    : 'freq-0'
                }`}
                aria-label="Frequency"
                aria-labelledby="frequency-question"
                aria-valuemin={0}
                aria-valuemax={3}
                aria-valuenow={
                  frequency?.value === 'always'
                    ? 3
                    : frequency?.value === 'often'
                    ? 2
                    : frequency?.value === 'sometimes'
                    ? 1
                    : 0
                }
                aria-valuetext={
                  frequency?.value === 'always'
                    ? 'Always'
                    : frequency?.value === 'often'
                    ? 'Often'
                    : frequency?.value === 'sometimes'
                    ? 'Sometimes'
                    : 'Once'
                }
              />
              <div className="frequency-slider-labels">
                <span className={`frequency-slider-label ${frequency?.value === 'once' ? 'active' : ''}`}>Une fois</span>
                <span className={`frequency-slider-label ${frequency?.value === 'sometimes' ? 'active' : ''}`}>Parfois</span>
                <span className={`frequency-slider-label ${frequency?.value === 'often' ? 'active' : ''}`}>Souvent</span>
                <span className={`frequency-slider-label ${frequency?.value === 'always' ? 'active' : ''}`}>Toujours</span>
              </div>
            </div>
          </div>
        )}

        {isEverythingFine === false && step === 10 && (
          <div className="form-step">
            <SafetyThermometerComponent
              onSelect={setSafety}
              selectedSafety={safety || undefined}
            />
          </div>
        )}

        {/* Step 11 removed in new flow (physical details now at step 3) */}

        {isEverythingFine === false && step > 1 && (
          <div className="form-actions">
            <Button variant="outline" onClick={handlePrev} className="previous-btn">
              Précédent
            </Button>
            {currentPos < visibleSteps.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="next-btn">
                Suivant
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="next-btn">
                {isSubmitting ? 'Envoi...' : 'Envoyer le signalement'}
              </Button>
            )}
          </div>
        )}
        {isEverythingFine === true && isSubmitting && (
          <div className="form-actions">
            <div className="submitting-message">
              <p>Envoi de ton signalement...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
