import { useMemo } from 'react';
import type { Lineup as LineupType, Event, PlayerMatchStats } from '../../types/statsbomb';
import { buildPlayerStats, getPlayerKeyEvents } from '../../lib/transformers';

interface LineupProps {
  lineups: LineupType[];
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  className?: string;
}

export function Lineup({
  lineups,
  events,
  homeTeamId,
  awayTeamId,
  className = '',
}: LineupProps) {
  const homeLineup = lineups.find((l) => l.team_id === homeTeamId);
  const awayLineup = lineups.find((l) => l.team_id === awayTeamId);

  const homeStats = useMemo(
    () => buildPlayerStats(events, lineups, homeTeamId),
    [events, lineups, homeTeamId]
  );

  const awayStats = useMemo(
    () => buildPlayerStats(events, lineups, awayTeamId),
    [events, lineups, awayTeamId]
  );

  if (!homeLineup || !awayLineup) {
    return <div className="text-gray-500">Lineup data not available</div>;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <TeamLineup
        lineup={homeLineup}
        stats={homeStats}
        events={events}
        lineups={lineups}
        isHome={true}
      />
      <TeamLineup
        lineup={awayLineup}
        stats={awayStats}
        events={events}
        lineups={lineups}
        isHome={false}
      />
    </div>
  );
}

interface TeamLineupProps {
  lineup: LineupType;
  stats: PlayerMatchStats[];
  events: Event[];
  lineups: LineupType[];
  isHome: boolean;
}

function TeamLineup({ lineup, stats, events, lineups, isHome }: TeamLineupProps) {
  const starters = stats.filter((s) => s.substitutedIn === undefined);
  const subs = stats.filter((s) => s.substitutedIn !== undefined);

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        isHome ? 'border-l-4 border-team-home' : 'border-l-4 border-team-away'
      }`}
    >
      <h3 className="font-bold text-lg mb-3">{lineup.team_name}</h3>

      {/* Starting XI */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-2">Starting XI</h4>
        <div className="space-y-1">
          {starters.map((player) => (
            <PlayerRow
              key={player.playerId}
              player={player}
              events={events}
              lineups={lineups}
              isHome={isHome}
            />
          ))}
        </div>
      </div>

      {/* Substitutes */}
      {subs.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-500 mb-2">Substitutes</h4>
          <div className="space-y-1">
            {subs.map((player) => (
              <PlayerRow
                key={player.playerId}
                player={player}
                events={events}
                lineups={lineups}
                isHome={isHome}
                isSub
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PlayerRowProps {
  player: PlayerMatchStats;
  events: Event[];
  lineups: LineupType[];
  isHome: boolean;
  isSub?: boolean;
}

function PlayerRow({ player, events, lineups, isHome, isSub }: PlayerRowProps) {
  const keyEvents = useMemo(
    () => getPlayerKeyEvents(events, lineups, player.playerId),
    [events, lineups, player.playerId]
  );

  return (
    <div
      className={`flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 ${
        isSub ? 'text-gray-600' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Jersey number */}
        <span
          className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
            isHome
              ? 'bg-team-home text-white'
              : 'bg-team-away text-white'
          }`}
        >
          {player.jerseyNumber}
        </span>

        {/* Player name */}
        <span className="text-sm">{player.playerName}</span>

        {/* Key event icons */}
        <div className="flex items-center gap-1">
          {keyEvents.map((event, i) => (
            <EventIcon key={i} event={event} />
          ))}
        </div>
      </div>

      {/* Position and minutes */}
      <div className="text-xs text-gray-400">
        {player.position !== 'Unknown' && (
          <span className="mr-2">{player.position}</span>
        )}
        {isSub && player.substitutedIn !== undefined && (
          <span className="text-green-600">{player.substitutedIn}'</span>
        )}
        {player.substitutedOut !== undefined && (
          <span className="text-red-600 ml-1">{player.substitutedOut}'</span>
        )}
      </div>
    </div>
  );
}

interface EventIconProps {
  event: {
    type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub_in' | 'sub_out';
    minute: number;
    period: number;
  };
}

function EventIcon({ event }: EventIconProps) {
  const minute = event.minute + (event.period === 2 ? 45 : 0);

  switch (event.type) {
    case 'goal':
      return (
        <span
          className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full"
          title={`Goal ${minute}'`}
        >
          G
        </span>
      );
    case 'assist':
      return (
        <span
          className="inline-flex items-center justify-center w-5 h-5 bg-blue-400 text-white text-[10px] font-bold rounded-full"
          title={`Assist ${minute}'`}
        >
          A
        </span>
      );
    case 'yellow':
      return (
        <span
          className="inline-block w-3 h-4 bg-yellow-400 rounded-sm"
          title={`Yellow card ${minute}'`}
        />
      );
    case 'red':
      return (
        <span
          className="inline-block w-3 h-4 bg-red-600 rounded-sm"
          title={`Red card ${minute}'`}
        />
      );
    default:
      return null;
  }
}

export default Lineup;
