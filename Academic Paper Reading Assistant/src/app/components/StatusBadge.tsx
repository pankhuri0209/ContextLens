import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'processing' | 'ready' | 'failed';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = {
    processing: {
      icon: Clock,
      label: 'Processing',
      className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    ready: {
      icon: CheckCircle,
      label: 'Ready',
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-red-50 text-red-700 border-red-200'
    }
  };

  const { icon: Icon, label, className } = config[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${className} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span className="font-medium">{label}</span>
    </div>
  );
}
