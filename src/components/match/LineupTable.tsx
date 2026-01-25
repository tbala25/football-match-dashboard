import { useMemo } from 'react';
import type { Lineup as LineupType, Event } from '../../types/statsbomb';
import { buildPlayerStats, getPlayerKeyEvents } from '../../lib/transformers';

interface LineupTableProps {
  lineups: LineupType[];
  events: Event[];
  teamId: number;
  className?: string;
}

export function LineupTable({
  lineups,
  events,
  teamId,
  className = '',
}: LineupTableProps) {
  const stats = useMemo(
    () => buildPlayerStats(events, lineups, teamId),
    [events, lineups, teamId]
  );

  const allKeyEvents = useMemo(() => {
    const eventMap = new Map<number, ReturnType<typeof getPlayerKeyEvents>>();
    for (const player of stats) {
      eventMap.set(player.playerId, getPlayerKeyEvents(events, lineups, player.playerId));
    }
    return eventMap;
  }, [events, lineups, stats]);

  return (
    <div className={`bg-white text-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1 border-b text-xs text-gray-400">
        <div className="w-6"></div>
        <div className="w-8">Pos</div>
        <div className="flex-1">Name</div>
        <div className="w-8 text-center">Min</div>
        <div className="w-16 text-center">Stats</div>
      </div>

      {/* Players */}
      <div className="divide-y divide-gray-100">
        {stats.map((player) => {
          const keyEvents = allKeyEvents.get(player.playerId) ?? [];
          const isSubIn = player.substitutedIn !== undefined;
          const isSubOut = player.substitutedOut !== undefined;

          return (
            <div
              key={player.playerId}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50"
            >
              {/* Sub indicator */}
              <div className="w-6 flex items-center justify-center">
                {isSubIn && (
                  <span className="text-green-500 text-xs">▲</span>
                )}
                {isSubOut && !isSubIn && (
                  <span className="text-red-500 text-xs">▼</span>
                )}
              </div>

              {/* Position */}
              <div className="w-8 text-xs text-gray-500">
                {getPositionAbbrev(player.position)}
              </div>

              {/* Name */}
              <div className="flex-1 truncate">
                {player.playerName}
              </div>

              {/* Minutes */}
              <div className="w-8 text-center text-gray-500">
                {player.minutesPlayed}'
              </div>

              {/* Event icons */}
              <div className="w-16 flex items-center justify-end gap-0.5">
                {keyEvents.map((event, i) => (
                  <EventIcon key={i} event={event} />
                ))}
                {player.cards.yellow > 0 && (
                  <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-sm" />
                )}
                {player.cards.red > 0 && (
                  <span className="inline-block w-2.5 h-3.5 bg-red-600 rounded-sm" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getPositionAbbrev(position: string): string {
  const abbrevs: Record<string, string> = {
    'Goalkeeper': 'GK',
    'Right Back': 'RB',
    'Left Back': 'LB',
    'Right Wing Back': 'RWB',
    'Left Wing Back': 'LWB',
    'Center Back': 'CB',
    'Right Center Back': 'RCB',
    'Left Center Back': 'LCB',
    'Defensive Midfield': 'DM',
    'Right Defensive Midfield': 'RDM',
    'Left Defensive Midfield': 'LDM',
    'Center Midfield': 'CM',
    'Right Center Midfield': 'RCM',
    'Left Center Midfield': 'LCM',
    'Center Defensive Midfield': 'CDM',
    'Center Attacking Midfield': 'CAM',
    'Right Midfield': 'RM',
    'Left Midfield': 'LM',
    'Right Wing': 'RW',
    'Left Wing': 'LW',
    'Right Center Forward': 'RCF',
    'Left Center Forward': 'LCF',
    'Center Forward': 'CF',
    'Striker': 'ST',
  };
  return abbrevs[position] ?? position.substring(0, 3).toUpperCase();
}

interface EventIconProps {
  event: {
    type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub_in' | 'sub_out';
    minute: number;
    period: number;
  };
}

function EventIcon({ event }: EventIconProps) {
  switch (event.type) {
    case 'goal':
      return (
        <span className="text-xs" title="Goal">⚽</span>
      );
    case 'assist':
      return (
        <span className="text-xs text-blue-500 font-bold" title="Assist">A</span>
      );
    default:
      return null;
  }
}

export default LineupTable;
