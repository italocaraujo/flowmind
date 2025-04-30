
import React from 'react';

export type EnergyLevel = 'low' | 'medium' | 'high';

interface EnergySelectorProps {
  value: EnergyLevel | null;
  onChange: (level: EnergyLevel) => void;
}

const EnergySelector: React.FC<EnergySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Qual seu nível de energia?</h3>
      <div className="flex space-x-4">
        {['low', 'medium', 'high'].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level as EnergyLevel)}
            className={`
              flex-1 py-2 px-3 border rounded-md transition-all
              ${value === level ? 'border-flowmind-500 ring-1 ring-flowmind-500' : 'border-gray-300'}
              bg-energy-${level}
            `}
          >
            <div className="flex flex-col items-center">
              <div className="h-4 mb-1">
                {[...Array(level === 'low' ? 1 : level === 'medium' ? 2 : 3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 h-1 bg-gray-700 rounded-full inline-block mx-0.5"
                  />
                ))}
              </div>
              <span className="text-xs font-medium">
                {level === 'low' ? 'Baixo' : level === 'medium' ? 'Médio' : 'Alto'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnergySelector;
