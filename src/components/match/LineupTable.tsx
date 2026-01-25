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

  // Separate starters from substitutes
  const { starters, substitutes } = useMemo(() => {
    const startersArr = stats.filter(p => p.substitutedIn === undefined);
    const subsArr = stats.filter(p => p.substitutedIn !== undefined);

    // Sort starters by position (GK first, then defenders, midfielders, forwards)
    const positionOrder: Record<string, number> = {
      'Goalkeeper': 0,
      'GK': 0,
      'Right Back': 1, 'RB': 1,
      'Right Center Back': 2, 'RCB': 2,
      'Center Back': 2, 'CB': 2,
      'Left Center Back': 2, 'LCB': 2,
      'Left Back': 3, 'LB': 3,
      'Right Wing Back': 1, 'RWB': 1,
      'Left Wing Back': 3, 'LWB': 3,
      'Defensive Midfield': 4, 'DM': 4, 'CDM': 4,
      'Right Defensive Midfield': 4, 'RDM': 4,
      'Left Defensive Midfield': 4, 'LDM': 4,
      'Center Midfield': 5, 'CM': 5,
      'Right Center Midfield': 5, 'RCM': 5,
      'Left Center Midfield': 5, 'LCM': 5,
      'Center Attacking Midfield': 6, 'CAM': 6,
      'Right Midfield': 5, 'RM': 5,
      'Left Midfield': 5, 'LM': 5,
      'Right Wing': 7, 'RW': 7,
      'Left Wing': 7, 'LW': 7,
      'Center Forward': 8, 'CF': 8,
      'Striker': 8, 'ST': 8,
      'Right Center Forward': 8, 'RCF': 8,
      'Left Center Forward': 8, 'LCF': 8,
    };

    startersArr.sort((a, b) => {
      const aOrder = positionOrder[a.position] ?? 10;
      const bOrder = positionOrder[b.position] ?? 10;
      return aOrder - bOrder;
    });

    // Sort substitutes by when they came on
    subsArr.sort((a, b) => (a.substitutedIn ?? 90) - (b.substitutedIn ?? 90));

    return { starters: startersArr, substitutes: subsArr };
  }, [stats]);

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
        <div className="w-5"></div>
        <div className="w-8">Pos</div>
        <div className="flex-1">Name</div>
        <div className="w-8 text-center">Min</div>
        <div className="w-12"></div>
      </div>

      {/* Starting XI */}
      <div className="divide-y divide-gray-100">
        {starters.map((player) => (
          <PlayerRow
            key={player.playerId}
            player={player}
            keyEvents={allKeyEvents.get(player.playerId) ?? []}
          />
        ))}
      </div>

      {/* Substitutes */}
      {substitutes.length > 0 && (
        <>
          <div className="px-2 py-1 bg-gray-50 text-xs text-gray-400 border-y">
            Substitutes
          </div>
          <div className="divide-y divide-gray-100">
            {substitutes.map((player) => (
              <PlayerRow
                key={player.playerId}
                player={player}
                keyEvents={allKeyEvents.get(player.playerId) ?? []}
                isSub
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface PlayerRowProps {
  player: ReturnType<typeof buildPlayerStats>[0];
  keyEvents: ReturnType<typeof getPlayerKeyEvents>;
  isSub?: boolean;
}

function PlayerRow({ player, keyEvents, isSub }: PlayerRowProps) {
  const isSubOut = player.substitutedOut !== undefined;

  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 ${isSub ? 'text-gray-600' : ''}`}>
      {/* Sub indicator */}
      <div className="w-5 flex items-center justify-center text-xs">
        {isSub && <span className="text-green-500">▲</span>}
        {isSubOut && !isSub && <span className="text-red-500">▼</span>}
      </div>

      {/* Position */}
      <div className="w-8 text-xs text-gray-500">
        {getPositionAbbrev(player.position)}
      </div>

      {/* Name */}
      <div className="flex-1 truncate text-xs">
        {player.playerName}
      </div>

      {/* Minutes */}
      <div className="w-8 text-center text-xs text-gray-500">
        {isSub ? `${player.substitutedIn}'` : `${player.minutesPlayed}'`}
      </div>

      {/* Event icons */}
      <div className="w-12 flex items-center justify-end gap-0.5">
        {keyEvents.filter(e => e.type === 'goal').map((_, i) => (
          <span key={`goal-${i}`} className="text-xs">⚽</span>
        ))}
        {keyEvents.filter(e => e.type === 'assist').map((_, i) => (
          <span key={`assist-${i}`} className="text-xs text-blue-500 font-bold">A</span>
        ))}
        {player.cards.yellow > 0 && (
          <span className="inline-block w-2 h-3 bg-yellow-400 rounded-sm" />
        )}
        {player.cards.red > 0 && (
          <span className="inline-block w-2 h-3 bg-red-600 rounded-sm" />
        )}
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

export default LineupTable;
