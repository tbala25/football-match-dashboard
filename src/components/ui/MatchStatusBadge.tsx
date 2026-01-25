interface MatchStatusBadgeProps {
  status: 'live' | 'finished' | 'halftime' | 'postponed' | 'scheduled';
  kickoffTime?: string;
  className?: string;
}

export function MatchStatusBadge({ status, kickoffTime, className = '' }: MatchStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'live':
        return {
          text: 'LIVE',
          bgClass: 'bg-red-500',
          textClass: 'text-white',
          animate: true,
        };
      case 'finished':
        return {
          text: 'FT',
          bgClass: 'bg-gray-700',
          textClass: 'text-white',
          animate: false,
        };
      case 'halftime':
        return {
          text: 'HT',
          bgClass: 'bg-amber-500',
          textClass: 'text-white',
          animate: true,
        };
      case 'postponed':
        return {
          text: 'PP',
          bgClass: 'bg-gray-400',
          textClass: 'text-white',
          animate: false,
        };
      case 'scheduled':
        return {
          text: kickoffTime || 'TBD',
          bgClass: 'bg-blue-500',
          textClass: 'text-white',
          animate: false,
        };
      default:
        return {
          text: 'FT',
          bgClass: 'bg-gray-700',
          textClass: 'text-white',
          animate: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2.5 py-1 rounded-md text-xs font-bold tracking-wide
        ${config.bgClass} ${config.textClass}
        ${config.animate ? 'animate-pulse-live' : ''}
        ${className}
      `}
    >
      {config.animate && (
        <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-ping-slow" />
      )}
      {config.text}
    </span>
  );
}

export default MatchStatusBadge;
