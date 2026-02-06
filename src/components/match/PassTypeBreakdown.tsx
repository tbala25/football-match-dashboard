import { useMemo } from 'react';
import type { PassTypeSummary, PassType } from '../../lib/transformers/passTypes';

interface PassTypeBreakdownProps {
  homeData: PassTypeSummary;
  awayData: PassTypeSummary;
  homeTeamName: string;
  awayTeamName: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

const PASS_TYPE_ORDER: PassType[] = ['progressive', 'through_ball', 'cross', 'switch', 'long_ball'];

function PassTypeBar({
  label: _label,
  count,
  successRate,
  maxCount,
  color,
  isReversed = false,
}: {
  label: string;
  count: number;
  successRate: number;
  maxCount: number;
  color: string;
  isReversed?: boolean;
}) {
  const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div className={`flex items-center gap-2 ${isReversed ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-1 h-5 bg-gray-100 rounded overflow-hidden ${isReversed ? 'flex justify-end' : ''}`}>
        <div
          className="h-full rounded transition-all duration-300"
          style={{
            width: `${barWidth}%`,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      </div>
      <div className={`w-8 text-xs font-medium ${isReversed ? 'text-right' : 'text-left'}`}>
        {count}
      </div>
      <div className={`w-10 text-xs text-gray-400 ${isReversed ? 'text-right' : 'text-left'}`}>
        {successRate.toFixed(0)}%
      </div>
    </div>
  );
}

export function PassTypeBreakdown({
  homeData,
  awayData,
  homeTeamName,
  awayTeamName,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: PassTypeBreakdownProps) {
  // Calculate max count for scaling bars
  const maxCount = useMemo(() => {
    let max = 0;
    for (const pt of homeData.passTypes) {
      if (pt.count > max) max = pt.count;
    }
    for (const pt of awayData.passTypes) {
      if (pt.count > max) max = pt.count;
    }
    return max;
  }, [homeData, awayData]);

  // Create lookup for quick access
  const homePassMap = useMemo(() => {
    const map = new Map<PassType, (typeof homeData.passTypes)[0]>();
    for (const pt of homeData.passTypes) {
      map.set(pt.type, pt);
    }
    return map;
  }, [homeData]);

  const awayPassMap = useMemo(() => {
    const map = new Map<PassType, (typeof awayData.passTypes)[0]>();
    for (const pt of awayData.passTypes) {
      map.set(pt.type, pt);
    }
    return map;
  }, [awayData]);

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title text-center mb-4">Pass Types</h3>

      {/* Team headers */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-3">
        <div className="text-sm font-semibold text-left" style={{ color: homeColor }}>
          {homeTeamName}
        </div>
        <div className="w-24" /> {/* Spacer for label column */}
        <div className="text-sm font-semibold text-right" style={{ color: awayColor }}>
          {awayTeamName}
        </div>
      </div>

      {/* Pass type rows */}
      <div className="space-y-2">
        {PASS_TYPE_ORDER.map((type) => {
          const homePT = homePassMap.get(type);
          const awayPT = awayPassMap.get(type);
          if (!homePT || !awayPT) return null;

          return (
            <div key={type} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Home bar (right-aligned) */}
              <PassTypeBar
                label={homePT.label}
                count={homePT.count}
                successRate={homePT.successRate}
                maxCount={maxCount}
                color={homeColor}
                isReversed={true}
              />

              {/* Center label */}
              <div className="w-24 text-center text-xs font-medium text-gray-600">
                {homePT.label}
              </div>

              {/* Away bar (left-aligned) */}
              <PassTypeBar
                label={awayPT.label}
                count={awayPT.count}
                successRate={awayPT.successRate}
                maxCount={maxCount}
                color={awayColor}
              />
            </div>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="mt-4 pt-3 border-t grid grid-cols-3 text-center text-xs">
        <div>
          <div className="font-semibold" style={{ color: homeColor }}>
            {homeData.totalPasses}
          </div>
          <div className="text-gray-400">Total Passes</div>
        </div>
        <div>
          <div className="font-semibold text-gray-600">
            {homeData.overallSuccessRate.toFixed(0)}% / {awayData.overallSuccessRate.toFixed(0)}%
          </div>
          <div className="text-gray-400">Pass Accuracy</div>
        </div>
        <div>
          <div className="font-semibold" style={{ color: awayColor }}>
            {awayData.totalPasses}
          </div>
          <div className="text-gray-400">Total Passes</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 text-center text-[10px] text-gray-400">
        Count shown with success rate %
      </div>
    </div>
  );
}

export default PassTypeBreakdown;
