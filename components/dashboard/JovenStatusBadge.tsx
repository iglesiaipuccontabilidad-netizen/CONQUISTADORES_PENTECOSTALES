import { CheckCircle2 } from 'lucide-react';

interface JovenStatusBadgeProps {
  label: string;
  checked: boolean;
  color: 'green' | 'purple' | 'amber' | 'blue';
  description?: string;
}

const colorStyles = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: 'text-green-600',
    text: 'text-green-900'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    icon: 'text-purple-600',
    text: 'text-purple-900'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: 'text-amber-600',
    text: 'text-amber-900'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: 'text-blue-600',
    text: 'text-blue-900'
  }
};

export function JovenStatusBadge({
  label,
  checked,
  color,
  description
}: JovenStatusBadgeProps) {
  const styles = colorStyles[color];

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
      checked
        ? `${styles.bg} ${styles.border}`
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex-shrink-0">
        {checked ? (
          <CheckCircle2 size={24} className={styles.icon} />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
        )}
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-semibold ${checked ? styles.text : 'text-slate-800'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 mt-1">
            {checked ? '✓ ' : ''}{description}
          </p>
        )}
      </div>
    </div>
  );
}
