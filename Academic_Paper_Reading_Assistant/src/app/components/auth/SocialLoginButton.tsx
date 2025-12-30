import React from 'react';
import { Button } from '../ui/button';
import { GraduationCap, FlaskConical, Building2 } from 'lucide-react';

interface SocialLoginButtonProps {
  provider: 'google-scholar' | 'orcid' | 'institution';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const providerConfig = {
  'google-scholar': {
    label: 'Continue with Google Scholar',
    icon: GraduationCap,
    color: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
  },
  orcid: {
    label: 'Continue with ORCID',
    icon: FlaskConical,
    color: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
  },
  institution: {
    label: 'Continue with Institution',
    icon: Building2,
    color: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
  },
};

export function SocialLoginButton({ provider, onClick, disabled, loading }: SocialLoginButtonProps) {
  const config = providerConfig[provider];
  const Icon = config.icon;

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full h-11 ${config.color} border-2 font-medium transition-all`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <Icon className="w-5 h-5 mr-2.5" />
      {loading ? 'Connecting...' : config.label}
    </Button>
  );
}
