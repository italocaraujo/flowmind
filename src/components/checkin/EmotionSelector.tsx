
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

export type Emotion = 'happy' | 'neutral' | 'sad' | 'energetic' | 'tired' | 'calm' | 'anxious';

interface EmotionOption {
  id: Emotion;
  label: string;
  color: string;
  hoverColor: string;
  icon?: React.ReactNode;
}

const emotions: EmotionOption[] = [
  { 
    id: 'happy', 
    label: 'Feliz', 
    color: 'bg-green-100 text-green-700 border-green-200', 
    hoverColor: 'hover:bg-green-200',
    icon: <Smile className="h-4 w-4 mr-1" />
  },
  { 
    id: 'calm', 
    label: 'Calmo', 
    color: 'bg-blue-100 text-blue-700 border-blue-200', 
    hoverColor: 'hover:bg-blue-200' 
  },
  { 
    id: 'energetic', 
    label: 'Energético', 
    color: 'bg-amber-100 text-amber-700 border-amber-200', 
    hoverColor: 'hover:bg-amber-200' 
  },
  { 
    id: 'neutral', 
    label: 'Neutro', 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    hoverColor: 'hover:bg-gray-200',
    icon: <Meh className="h-4 w-4 mr-1" />
  },
  { 
    id: 'tired', 
    label: 'Cansado', 
    color: 'bg-purple-100 text-purple-700 border-purple-200', 
    hoverColor: 'hover:bg-purple-200' 
  },
  { 
    id: 'anxious', 
    label: 'Ansioso', 
    color: 'bg-orange-100 text-orange-700 border-orange-200', 
    hoverColor: 'hover:bg-orange-200' 
  },
  { 
    id: 'sad', 
    label: 'Triste', 
    color: 'bg-red-100 text-red-700 border-red-200', 
    hoverColor: 'hover:bg-red-200',
    icon: <Frown className="h-4 w-4 mr-1" /> 
  },
];

interface EmotionSelectorProps {
  selectedEmotion: Emotion | null;
  onSelect: (emotion: Emotion) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedEmotion, onSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Como você está se sentindo hoje?</h3>
      <div className="flex flex-wrap gap-2">
        {emotions.map(emotion => (
          <button
            key={emotion.id}
            onClick={() => onSelect(emotion.id)}
            className={`emotion-tag flex items-center ${emotion.color} ${emotion.hoverColor} ${
              selectedEmotion === emotion.id ? 'ring-2 ring-ring ring-offset-1' : ''
            }`}
          >
            {emotion.icon}
            {emotion.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;
