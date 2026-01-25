import { useMemo } from 'react';
import type { Event } from '../../types/statsbomb';
import { getPassStats } from '../../lib/transformers';

interface MatchStatsProps {
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

interface StatRow {
  label: string;
  home: number;
  away: number;
  format?: 'number' | 'percent';
}

export function MatchStats({
  events,
  homeTeamId,
  awayTeamId,
  homeColor = '#EF0107',
  awayColor = '#6CABDD',
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
        return endX - startX > 10; // Forward progress of 10+ yards
      }).length;
    };

    // Circulation (passes in own half)
    const countCirculation = (teamId: number) => {
      return events.filter(e => {
        if (e.team?.id !== teamId || e.type.name !== 'Pass') return false;
        if (!e.location) return false;
        return e.location[0] < 60; // Own half
      }).length / Math.max(homePassStats.total, 1);
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
        return e.location[0] > 80; // Attacking third
      }).length;
    };

    const rows: StatRow[] = [
      {
        label: 'Start distance',
        home: Math.round(getAvgPassDistance(homeTeamId)),
        away: Math.round(getAvgPassDistance(awayTeamId)),
      },
      {
        label: 'Progression',
        home: Math.round((countProgressivePasses(homeTeamId) / Math.max(homePassStats.total, 1)) * 100),
        away: Math.round((countProgressivePasses(awayTeamId) / Math.max(awayPassStats.total, 1)) * 100),
        format: 'percent',
      },
      {
        label: 'Circulation',
        home: Math.round(countCirculation(homeTeamId) * 100) / 100,
        away: Math.round(countCirculation(awayTeamId) * 100) / 100,
      },
      {
        label: 'Build-ups',
        home: countBuildUps(homeTeamId),
        away: countBuildUps(awayTeamId),
      },
      {
        label: 'Fast breaks',
        home: countFastBreaks(homeTeamId),
        away: countFastBreaks(awayTeamId),
      },
      {
        label: 'High press',
        home: countHighPress(homeTeamId),
        away: countHighPress(awayTeamId),
      },
    ];

    return rows;
  }, [events, homeTeamId, awayTeamId]);

  return (
    <div className={`bg-white p-4 ${className}`}>
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
    return val.toString();
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* Home value */}
      <div className="w-10 text-right font-medium">{formatValue(stat.home)}</div>

      {/* Home bar */}
      <div className="w-20 flex justify-end">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-4 rounded-sm"
              style={{
                backgroundColor: i < Math.ceil(homeWidth / 20) ? homeColor : '#e5e7eb',
              }}
            />
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="flex-1 text-center text-gray-600 text-xs">{stat.label}</div>

      {/* Away bar */}
      <div className="w-20 flex justify-start">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-4 rounded-sm"
              style={{
                backgroundColor: i < Math.ceil(awayWidth / 20) ? awayColor : '#e5e7eb',
              }}
            />
          ))}
        </div>
      </div>

      {/* Away value */}
      <div className="w-10 text-left font-medium">{formatValue(stat.away)}</div>
    </div>
  );
}

export default MatchStats;
