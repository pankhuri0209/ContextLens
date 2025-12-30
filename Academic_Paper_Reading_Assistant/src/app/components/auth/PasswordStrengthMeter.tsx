import React from 'react';
import { Check, X } from 'lucide-react';
import { Progress } from '../ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
  showCriteria?: boolean;
}

export function PasswordStrengthMeter({ password, showCriteria = true }: PasswordStrengthMeterProps) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const metCriteria = Object.values(criteria).filter(Boolean).length;
  const strength = Math.min((metCriteria / 5) * 100, 100);

  let strengthLabel = 'Weak';
  let strengthColor = 'text-red-600';
  let progressColor = 'bg-red-500';

  if (metCriteria >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'text-green-600';
    progressColor = 'bg-green-500';
  } else if (metCriteria >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'text-yellow-600';
    progressColor = 'bg-yellow-500';
  }

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Progress value={strength} className="h-2" indicatorClassName={progressColor} />
        </div>
        <span className={`text-sm font-medium ${strengthColor}`}>
          {strengthLabel}
        </span>
      </div>

      {showCriteria && (
        <div className="space-y-1.5 text-sm">
          <PasswordCriterion met={criteria.length} text="At least 8 characters" />
          <PasswordCriterion met={criteria.uppercase} text="One uppercase letter" />
          <PasswordCriterion met={criteria.lowercase} text="One lowercase letter" />
          <PasswordCriterion met={criteria.number} text="One number" />
          <PasswordCriterion met={criteria.special} text="One special character" />
        </div>
      )}
    </div>
  );
}

function PasswordCriterion({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      <span>{text}</span>
    </div>
  );
}
