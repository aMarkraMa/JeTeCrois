/**
 * Emotional scale to express how the student feels
 */
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { EmotionScale } from '@/lib/api';
import feelingQuiet from '@/assets/icons/Answers/feeling_quiet.png';
import feelingConfusion from '@/assets/icons/Answers/feeling_confusion.png';
import feelingPessimism from '@/assets/icons/Answers/feeling_pessimism.png';
import feelingFear from '@/assets/icons/Answers/feeling_fear.png';
import feelingAngry from '@/assets/icons/Answers/feeling_angry.png';
import howDoYouFeelIcon from '@/assets/icons/questions/How_u_feel.png';
import './EmotionScale.css';

const emotionLevels = [
  { level: 1, color: 'green', label: 'Calme', icon: feelingQuiet, feeling: 'quiet' },
  { level: 2, color: 'yellow', label: 'Confusion', icon: feelingConfusion, feeling: 'confusion' },
  { level: 3, color: 'orange', label: 'Pessimisme', icon: feelingPessimism, feeling: 'pessimism' },
  { level: 4, color: 'red', label: 'Peur', icon: feelingFear, feeling: 'fear' },
  { level: 5, color: 'dark-red', label: 'En colère', icon: feelingAngry, feeling: 'angry' },
];

const colorClasses: Record<string, string> = {
  green: 'bg-green-500 hover:bg-green-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  red: 'bg-red-500 hover:bg-red-600',
  'dark-red': 'bg-red-700 hover:bg-red-800',
};

interface EmotionScaleProps {
  onSelect: (emotion: EmotionScale) => void;
  selectedEmotion?: EmotionScale;
}

export function EmotionScaleComponent({ onSelect, selectedEmotion }: EmotionScaleProps) {
  const [selected, setSelected] = useState<number>(selectedEmotion?.level || 0);

  useEffect(() => {
    if (selectedEmotion) {
      setSelected(selectedEmotion.level);
    }
  }, [selectedEmotion]);

  const handleSelect = (level: number, color: string) => {
    setSelected(level);
    onSelect({ level, color });
  };

  return (
    <div className="emotion-scale">
      <div className="question-header">
        <img src={howDoYouFeelIcon} alt="How do you feel" className="question-icon" />
        <h3 className="text-lg font-semibold mb-4">Comment te sens-tu ?</h3>
      </div>
      <div className="emotion-buttons">
        {emotionLevels.map((emotion) => (
          <button
            key={emotion.level}
            onClick={() => handleSelect(emotion.level, emotion.color)}
            className={cn(
              'emotion-button',
              colorClasses[emotion.color],
              selected === emotion.level && 'ring-4 ring-offset-2 ring-blue-400 scale-110'
            )}
            title={emotion.label}
          >
            <div className="emotion-icon">
              <img src={emotion.icon} alt={emotion.label} />
            </div>
            <span className="emotion-label">{emotion.label}</span>
          </button>
        ))}
      </div>
      {selected > 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Niveau sélectionné : {emotionLevels[selected - 1].label}
        </p>
      )}
    </div>
  );
}

