import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface RelevanceScoreProps {
  score: number;
  reasoning?: string;
  editable?: boolean;
  onChange?: (score: number) => void;
}

export function RelevanceScore({ score, reasoning, editable = false, onChange }: RelevanceScoreProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localScore, setLocalScore] = useState(score);

  const getColor = (value: number) => {
    if (value >= 80) return { bg: '#10B981', text: '#065F46' };
    if (value >= 60) return { bg: '#F59E0B', text: '#92400E' };
    return { bg: '#EF4444', text: '#991B1B' };
  };

  const color = getColor(score);
  const gradient = `linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%)`;

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value);
    setLocalScore(newScore);
    if (onChange) {
      onChange(newScore);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-24 h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300 rounded-full"
          style={{
            width: `${score}%`,
            background: gradient,
            clipPath: `inset(0 ${100 - score}% 0 0)`
          }}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-full border-2 hover:shadow-sm transition-all"
            style={{ borderColor: color.bg, backgroundColor: `${color.bg}15`, color: color.text }}
          >
            <span className="font-semibold tabular-nums">{score}</span>
            {reasoning && <Info className="w-3 h-3" />}
          </button>
        </PopoverTrigger>
        {reasoning && (
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Relevance Explanation</h4>
              <p className="text-sm text-gray-600">{reasoning}</p>
              {editable && (
                <div className="pt-2 border-t">
                  <label className="text-xs text-gray-600 block mb-2">Adjust score manually:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localScore}
                    onChange={handleScoreChange}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: gradient
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{localScore}</span>
                    <span>100</span>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
