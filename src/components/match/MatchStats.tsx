import { useMemo } from 'react';
import type { Event } from '../../types/statsbomb';
import { getPassStats } from '../../lib/transformers';

interface MatchStatsProps {
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName?: string;
  awayTeamName?: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

interface StatRow {
  label: string;
  home: number;
  away: number;
  format?: 'number' | 'percent' | 'decimal';
  tooltip?: string;
  category: 'possession' | 'attacking' | 'defending';
}

export function MatchStats({
  events,
  homeTeamId,
  awayTeamId,
  homeTeamName = 'Home',
  awayTeamName = 'Away',
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: MatchStatsProps) {
  const stats = useMemo(() => {
    const homePassStats = getPassStats(events, homeTeamId);
    const awayPassStats = getPassStats(events, awayTeamId);

    // Calculate various stats
    const countByType = (teamId: number, types: string[]) =>
      events.filter(e => e.team?.id === teamId && types.includes(e.type.name)).length;

    const getAvgPassDistance = (teamId: number) => {
      const passes = events.filter(e => e.team?.id === teamId && e.type.name === 'Pass' && e.pass?.length);
      if (passes.length === 0) return 0;
      return passes.reduce((sum, p) => sum + (p.pass?.length ?? 0), 0) / passes.length;
    };

    // Progressive passes (passes that move ball forward significantly)
    const countProgressivePasses = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId || e.type.name !== 'Pass') return false;
        if (!e.location || !e.pass?.end_location) return false;
        const startX = e.location[0];
        const endX = e.pass.end_location[0];
        return endX - startX > 10;
      }).length;
    };

    // Circulation (passes in own half)
    const countCirculation = (teamId: number) => {
      const circulationPasses = events.filter(e => {
        if (e.team?.id !== teamId || e.type.name !== 'Pass') return false;
        if (!e.location) return false;
        return e.location[0] < 60;
      }).length;
      const totalPasses = teamId === homeTeamId ? homePassStats.total : awayPassStats.total;
      return totalPasses > 0 ? (circulationPasses / totalPasses) * 100 : 0;
    };

    // Build-ups (sustained possession sequences)
    const countBuildUps = (teamId: number) => {
      let buildUps = 0;
      let currentPossession = -1;
      let passCount = 0;

      for (const e of events) {
        if (e.possession !== currentPossession) {
          if (passCount >= 5) buildUps++;
          currentPossession = e.possession;
          passCount = 0;
        }
        if (e.team?.id === teamId && e.type.name === 'Pass' && !e.pass?.outcome) {
          passCount++;
        }
      }
      return buildUps;
    };

    // Fast breaks (quick counter attacks)
    const countFastBreaks = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId) return false;
        return e.play_pattern?.name === 'From Counter';
      }).length;
    };

    // High press (recoveries in attacking third)
    const countHighPress = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId) return false;
        if (!e.location) return false;
        if (!['Ball Recovery', 'Interception'].includes(e.type.name)) return false;
        return e.location[0] > 80;
      }).length;
    };

    // Duels won
    const countDuelsWon = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId) return false;
        return e.type.name === 'Duel' && e.duel?.outcome?.name?.includes('Won');
      }).length;
    };

    // Aerial duels
    const countAerialDuels = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId) return false;
        return e.type.name === 'Duel' && e.duel?.type?.name === 'Aerial Lost' ||
               e.type.name === 'Miscontrol' && e.aerial_won;
      }).length;
    };

    const rows: StatRow[] = [
      // Possession category
      {
        label: 'Pass Accuracy',
        home: Math.round(homePassStats.accuracy),
        away: Math.round(awayPassStats.accuracy),
        format: 'percent',
        tooltip: 'Percentage of successful passes',
        category: 'possession',
      },
      {
        label: 'Avg Pass Distance',
        home: Math.round(getAvgPassDistance(homeTeamId) * 10) / 10,
        away: Math.round(getAvgPassDistance(awayTeamId) * 10) / 10,
        format: 'decimal',
        tooltip: 'Average length of passes in yards',
        category: 'possession',
      },
      {
        label: 'Circulation',
        home: Math.round(countCirculation(homeTeamId)),
        away: Math.round(countCirculation(awayTeamId)),
        format: 'percent',
        tooltip: 'Percentage of passes in own half',
        category: 'possession',
      },
      // Attacking category
      {
        label: 'Progressive Passes',
        home: countProgressivePasses(homeTeamId),
        away: countProgressivePasses(awayTeamId),
        tooltip: 'Passes that advance the ball 10+ yards toward goal',
        category: 'attacking',
      },
      {
        label: 'Build-ups',
        home: countBuildUps(homeTeamId),
        away: countBuildUps(awayTeamId),
        tooltip: 'Possession sequences with 5+ passes',
        category: 'attacking',
      },
      {
        label: 'Fast Breaks',
        home: countFastBreaks(homeTeamId),
        away: countFastBreaks(awayTeamId),
        tooltip: 'Counter-attacking moves',
        category: 'attacking',
      },
      // Defending category
      {
        label: 'High Press',
        home: countHighPress(homeTeamId),
        away: countHighPress(awayTeamId),
        tooltip: 'Ball recoveries in attacking third',
        category: 'defending',
      },
      {
        label: 'Duels Won',
        home: countDuelsWon(homeTeamId),
        away: countDuelsWon(awayTeamId),
        tooltip: 'Ground duels won',
        category: 'defending',
      },
    ];

    return rows;
  }, [events, homeTeamId, awayTeamId]);

  // Group stats by category
  const possessionStats = stats.filter(s => s.category === 'possession');
  const attackingStats = stats.filter(s => s.category === 'attacking');
  const defendingStats = stats.filter(s => s.category === 'defending');

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title mb-4">Match Statistics</h3>

      {/* Team header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="font-semibold text-sm" style={{ color: homeColor }}>{homeTeamName}</span>
        <span className="font-semibold text-sm" style={{ color: awayColor }}>{awayTeamName}</span>
      </div>

      {/* Possession stats */}
      <StatCategory title="Possession" stats={possessionStats} homeColor={homeColor} awayColor={awayColor} />

      {/* Attacking stats */}
      <StatCategory title="Attacking" stats={attackingStats} homeColor={homeColor} awayColor={awayColor} />

      {/* Defending stats */}
      <StatCategory title="Defending" stats={defendingStats} homeColor={homeColor} awayColor={awayColor} />
    </div>
  );
}

interface StatCategoryProps {
  title: string;
  stats: StatRow[];
  homeColor: string;
  awayColor: string;
}

function StatCategory({ title, stats, homeColor, awayColor }: StatCategoryProps) {
  return (
    <div className="mb-4">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
        {title}
      </div>
      <div className="space-y-2">
        {stats.map((stat, i) => (
          <StatRowDisplay
            key={i}
            stat={stat}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        ))}
      </div>
    </div>
  );
}

interface StatRowDisplayProps {
  stat: StatRow;
  homeColor: string;
  awayColor: string;
}

function StatRowDisplay({ stat, homeColor, awayColor }: StatRowDisplayProps) {
  const maxVal = Math.max(stat.home, stat.away, 1);
  const homeWidth = (stat.home / maxVal) * 100;
  const awayWidth = (stat.away / maxVal) * 100;

  const formatValue = (val: number) => {
    if (stat.format === 'percent') return `${val}%`;
    if (stat.format === 'decimal') return val.toFixed(1);
    return val.toString();
  };

  // Determine which side is "winning" this stat
  const homeLead = stat.home > stat.away;
  const awayLead = stat.away > stat.home;

  return (
    <div className="group relative" title={stat.tooltip}>
      {/* Label centered */}
      <div className="text-xs text-gray-500 text-center mb-1 font-medium">
        {stat.label}
      </div>

      <div className="flex items-center gap-2">
        {/* Home value */}
        <div
          className={`w-12 text-right text-sm font-bold ${homeLead ? '' : 'text-opacity-70'}`}
          style={{ color: homeColor }}
        >
          {formatValue(stat.home)}
        </div>

        {/* Bar container */}
        <div className="flex-1 flex gap-0.5">
          {/* Home bar (right-aligned, grows left) */}
          <div className="flex-1 flex justify-end">
            <div className="h-2 bg-gray-100 rounded-l-full w-full relative overflow-hidden">
              <div
                className="absolute right-0 h-full rounded-l-full transition-all duration-500"
                style={{
                  width: `${homeWidth}%`,
                  backgroundColor: homeColor,
                  opacity: homeLead ? 1 : 0.6,
                }}
              />
            </div>
          </div>

          {/* Away bar (left-aligned, grows right) */}
          <div className="flex-1 flex justify-start">
            <div className="h-2 bg-gray-100 rounded-r-full w-full relative overflow-hidden">
              <div
                className="absolute left-0 h-full rounded-r-full transition-all duration-500"
                style={{
                  width: `${awayWidth}%`,
                  backgroundColor: awayColor,
                  opacity: awayLead ? 1 : 0.6,
                }}
              />
            </div>
          </div>
        </div>

        {/* Away value */}
        <div
          className={`w-12 text-left text-sm font-bold ${awayLead ? '' : 'text-opacity-70'}`}
          style={{ color: awayColor }}
        >
          {formatValue(stat.away)}
        </div>
      </div>

      {/* Tooltip indicator */}
      {stat.tooltip && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {stat.tooltip}
        </div>
      )}
    </div>
  );
}

export default MatchStats;
