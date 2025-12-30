import React from 'react';

interface ImportanceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ImportanceScore({ score, size = 'md', showLabel = true }: ImportanceScoreProps) {
  const getColor = () => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 40) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-2';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const getLabel = () => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'Core Method';
    if (score >= 40) return 'Supporting';
    return 'Background';
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border ${getColor()} ${getSizeClasses()}`}>
      <div className="flex items-center gap-1.5">
        <div className="relative w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-current transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="font-semibold tabular-nums">{score}</span>
      </div>
      {showLabel && size !== 'sm' && (
        <span className="font-medium">{getLabel()}</span>
      )}
    </div>
  );
}
