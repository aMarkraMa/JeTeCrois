/**
 * Find Out Page - Educational content about preventing harassment
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, X, Check } from 'lucide-react';
import './FindOut.css';

// Training slides data with isGood property
const trainingSlides = [
  {
    id: 1,
    gif: 'src/assets/gifs/StrangerDanger.gif',
    title: 'Danger étranger',
    description: 'Si un étranger s\'approche ou offre quelque chose qui semble mal, dis non, éloigne-toi et demande de l\'aide à un adulte de confiance.',
    isGood: false, // This is a BAD scenario
    question: 'Cette situation est-elle sûre ou dangereuse?'
  },
  {
    id: 2,
    gif: 'src/assets/gifs/PersonalSpaces.gif',
    title: 'Espace personnel et parties intimes',
    description: 'Ton espace personnel et tes parties intimes t\'appartiennent. Si quelqu\'un essaie de te toucher, dis non, éloigne-toi et dis-le à un adulte de confiance.',
    isGood: true, // Knowing about personal space is GOOD
    question: 'Connaître les limites personnelles est-il bon ou mauvais?'
  },
  {
    id: 3,
    gif: 'src/assets/gifs/BadTouch.gif',
    title: 'Mauvais contact',
    description: 'Si quelqu\'un te touche d\'une manière qui te met mal à l\'aise, dis non, cours et dis-le immédiatement à un adulte de confiance.',
    isGood: false, // This is a BAD scenario
    question: 'Ce type de contact est-il sûr ou dangereux?'
  },
  {
    id: 4,
    gif: 'src/assets/gifs/SexualHarasment.gif',
    title: 'Harcèlement physique/sexuel',
    description: 'Si quelqu\'un te touche, t\'attrape ou se comporte d\'une manière qui te semble dangereuse, dis non fort, éloigne-toi et cherche de l\'aide auprès d\'un adulte de confiance.',
    isGood: false, // This is a BAD scenario
    question: 'Ce comportement est-il acceptable ou inacceptable?'
  },
  {
    id: 5,
    gif: 'src/assets/gifs/AdultContent.gif',
    title: 'Contenu pour adultes',
    description: 'Si tu vois accidentellement du contenu pour adultes ou inapproprié, détourne le regard, quitte la situation et dis-le à un adulte de confiance.',
    isGood: false, // This is a BAD scenario
    question: 'Regarder du contenu pour adultes est-il sûr pour les enfants?'
  },
  {
    id: 6,
    gif: 'src/assets/gifs/Bully.gif',
    title: 'Intimidation',
    description: 'Si quelqu\'un se moque de toi, te fait mal ou te fait peur, dis stop, éloigne-toi et demande de l\'aide à un adulte de confiance.',
    isGood: false, // This is a BAD scenario
    question: 'L\'intimidation est-elle un comportement acceptable?'
  },
  {
    id: 7,
    gif: 'src/assets/gifs/Uncomfortable.gif',
    title: 'Se sentir mal à l\'aise',
    description: 'Si quelque chose ou quelqu\'un te met mal à l\'aise, écoute ce sentiment—dis non, éloigne-toi et parle à un adulte de confiance.',
    isGood: false, // Feeling uncomfortable is a warning sign (BAD situation)
    question: 'Dois-tu ignorer les sentiments d\'inconfort?'
  },
  {
    id: 8,
    gif: 'src/assets/gifs/SeekHelp.gif',
    title: 'Parler à un adulte de confiance',
    description: 'Quand tu te sens effrayé, confus ou mal à l\'aise, parle à un adulte de confiance pour qu\'il puisse t\'aider à rester en sécurité.',
    isGood: true, // Seeking help is GOOD
    question: 'Parler à un adulte de confiance est-il une bonne action?'
  },
  {
    id: 9,
    gif: 'src/assets/gifs/AdultAttention.gif',
    title: 'Demander de l\'aide à un adulte de confiance',
    description: 'Si tu fais face à quelque chose de dangereux, dis non, éloigne-toi de la situation et demande immédiatement de l\'aide à un adulte de confiance.',
    isGood: true, // Seeking help is GOOD
    question: 'Demander de l\'aide aux adultes est-il une bonne réponse?'
  }
  
];

export function FindOut() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentContent = trainingSlides[currentSlide - 1];
  const isLastSlide = currentSlide === trainingSlides.length;

  const handleAnswer = (userAnswerIsGood: boolean) => {
    const isCorrect = userAnswerIsGood === currentContent.isGood;
    
    if (isCorrect) {
      setFeedback('correct');
      setShowAnswer(true);
      
      // Auto-advance to next slide after showing correct feedback
      setTimeout(() => {
        if (currentSlide < trainingSlides.length) {
          setCurrentSlide(currentSlide + 1);
          setFeedback(null);
          setShowAnswer(false);
        } else {
          // Last slide - show completion modal
          setShowCompletionModal(true);
        }
      }, 2000);
    } else {
      setFeedback('incorrect');
      
      // Reset feedback after 2 seconds to allow retry
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  return (
    <div className="find-out-page">
      <div className="find-out-container">
        <Link to="/" className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Accueil</span>
        </Link>

        <div className="find-out-header">
          <h1 className="find-out-title">Formation de sensibilisation au harcèlement</h1>
          <p className="find-out-subtitle">
            Apprends à prévenir le harcèlement et à rester en sécurité
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentSlide / trainingSlides.length) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            Diapositive {currentSlide} sur {trainingSlides.length}
          </p>
        </div>

        {/* Training Content */}
        <div className="educational-content">
          <div className="content-section training-slide">
            <div className="gif-container">
              <img 
                src={currentContent.gif}
                alt={`Training slide ${currentSlide}`}
                className="section-gif"
              />
            </div>
            <h2 className="section-title">{currentContent.title}</h2>
            
            {/* Question */}
            {!showAnswer && (
              <div className="question-container">
                <p className="question-text">{currentContent.question}</p>
              </div>
            )}

            {/* Answer Buttons */}
            {!showAnswer && (
              <div className="answer-buttons">
                <button
                  className={`answer-btn bad-btn ${feedback === 'incorrect' ? 'shake' : ''}`}
                  onClick={() => handleAnswer(false)}
                  disabled={feedback !== null}
                >
                  <X className="answer-icon" />
                  <span>Dangereux/Mauvais</span>
                </button>
                <button
                  className={`answer-btn good-btn ${feedback === 'incorrect' ? 'shake' : ''}`}
                  onClick={() => handleAnswer(true)}
                  disabled={feedback !== null}
                >
                  <Check className="answer-icon" />
                  <span>Sûr/Bon</span>
                </button>
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <div className={`feedback-message ${feedback}`}>
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle className="feedback-icon" />
                    <p className="feedback-text">Correct! Bien joué!</p>
                  </>
                ) : (
                  <>
                    <X className="feedback-icon" />
                    <p className="feedback-text">Faux! Réessaie.</p>
                  </>
                )}
              </div>
            )}

            {/* Show description after correct answer */}
            {showAnswer && (
              <div className="answer-explanation">
                <p className="section-text">{currentContent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <CheckCircle className="success-icon" />
            </div>
            <h2 className="modal-title">Félicitations!</h2>
            <p className="modal-message">
              Formation de sensibilisation au harcèlement terminée
            </p>
            <p className="modal-submessage">
              Tu as terminé avec succès tous les modules de formation. Tu as maintenant les connaissances pour reconnaître, prévenir et signaler le harcèlement.
            </p>
            <div className="modal-actions">
              <Link to="/">
                <Button size="lg" className="modal-btn">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

