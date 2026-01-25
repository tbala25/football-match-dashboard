import type { Event, Lineup } from '../../types/statsbomb';
import { useMemo } from 'react';

interface KeyMoment {
  minute: number;
  type: 'goal' | 'own_goal' | 'penalty_goal' | 'penalty_miss' | 'yellow' | 'red' | 'sub' | 'var';
  team: 'home' | 'away';
  playerName: string;
  assistName?: string;
  detail?: string;
}

interface KeyMomentsProps {
  events: Event[];
  lineups: Lineup[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function KeyMoments({
  events,
  lineups,
  homeTeamId,
  awayTeamId,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: KeyMomentsProps) {
  const moments = useMemo(() => {
    const keyMoments: KeyMoment[] = [];

    for (const event of events) {
      const isHome = event.team.id === homeTeamId;

      if (event.type.name === 'Shot' && event.shot?.outcome.name === 'Goal') {
        const isPenalty = event.shot.type?.name === 'Penalty';
        keyMoments.push({
          minute: event.minute + (event.period === 2 ? 45 : 0),
          type: isPenalty ? 'penalty_goal' : 'goal',
          team: isHome ? 'home' : 'away',
          playerName: event.player?.name || 'Unknown',
        });
      }

      if (event.type.name === 'Own Goal For') {
        keyMoments.push({
          minute: event.minute + (event.period === 2 ? 45 : 0),
          type: 'own_goal',
          team: isHome ? 'away' : 'home',
          playerName: event.player?.name || 'Unknown',
          detail: 'Own Goal',
        });
      }

      if (event.type.name === 'Shot' &&
          event.shot?.type?.name === 'Penalty' &&
          event.shot?.outcome.name !== 'Goal') {
        keyMoments.push({
          minute: event.minute + (event.period === 2 ? 45 : 0),
          type: 'penalty_miss',
          team: isHome ? 'home' : 'away',
          playerName: event.player?.name || 'Unknown',
          detail: `Penalty ${event.shot.outcome.name}`,
        });
      }
    }

    for (const lineup of lineups) {
      const isHome = lineup.team_id === homeTeamId;

      for (const player of lineup.lineup) {
        for (const card of player.cards) {
          const timeParts = card.time.split(':');
          const minute = timeParts.length >= 2
            ? parseInt(timeParts[0]) * 60 + parseInt(timeParts[1])
            : 0;

          const isRed = card.card_type === 'Red Card' || card.card_type === 'Second Yellow';

          keyMoments.push({
            minute,
            type: isRed ? 'red' : 'yellow',
            team: isHome ? 'home' : 'away',
            playerName: player.player_name,
            detail: card.card_type,
          });
        }

        for (const position of player.positions) {
          if (position.start_reason === 'Substitution') {
            const fromParts = position.from.split(':');
            const minute = fromParts.length >= 2
              ? parseInt(fromParts[0]) * 60 + parseInt(fromParts[1])
              : 0;

            keyMoments.push({
              minute,
              type: 'sub',
              team: isHome ? 'home' : 'away',
              playerName: player.player_name,
              detail: 'Substitution On',
            });
          }
        }
      }
    }

    return keyMoments.sort((a, b) => a.minute - b.minute);
  }, [events, lineups, homeTeamId, awayTeamId]);

  if (moments.length === 0) {
    return (
      <div className={`pro-card p-5 ${className}`}>
        <h3 className="section-title mb-4">Key Moments</h3>
        <p className="text-sm text-gray-400 text-center py-8">No key moments recorded</p>
      </div>
    );
  }

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title mb-4">Key Moments</h3>
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
        <div className="space-y-4">
          {moments.map((moment, i) => (
            <MomentItem key={i} moment={moment} homeColor={homeColor} awayColor={awayColor} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MomentItemProps {
  moment: KeyMoment;
  homeColor: string;
  awayColor: string;
}

function MomentItem({ moment, homeColor, awayColor }: MomentItemProps) {
  const isHome = moment.team === 'home';
  const teamColor = isHome ? homeColor : awayColor;

  const getIcon = () => {
    switch (moment.type) {
      case 'goal':
      case 'penalty_goal':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
      case 'own_goal':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" /></svg>;
      case 'penalty_miss':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="8" y1="8" x2="16" y2="16" /><line x1="16" y1="8" x2="8" y2="16" /></svg>;
      case 'yellow':
        return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />;
      case 'red':
        return <div className="w-3 h-4 bg-red-500 rounded-sm" />;
      case 'sub':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /><path d="M7.41 15.41L12 20l4.59-4.59L18 17l-6 6-6-6 1.41-1.41z" /></svg>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getBgColor = () => {
    switch (moment.type) {
      case 'goal':
      case 'penalty_goal':
        return 'bg-green-500';
      case 'own_goal':
        return 'bg-gray-500';
      case 'penalty_miss':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'red':
        return 'bg-red-500';
      case 'sub':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-1 ${isHome ? 'text-right' : 'text-left'}`}>
        <div className="text-sm font-semibold" style={{ color: teamColor }}>
          {moment.playerName.split(' ').pop()}
        </div>
        {moment.detail && <div className="text-xs text-gray-500">{moment.detail}</div>}
      </div>
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getBgColor()}`}>
          {getIcon()}
        </div>
        <span className="text-xs font-bold text-gray-600">{moment.minute}'</span>
      </div>
      <div className="flex-1" />
    </div>
  );
}

export default KeyMoments;
