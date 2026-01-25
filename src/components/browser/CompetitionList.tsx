import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompetitions, groupCompetitions } from '../../lib/api';
import type { Competition } from '../../types/statsbomb';

interface CompetitionListProps {
  className?: string;
}

export function CompetitionList({ className = '' }: CompetitionListProps) {
  const { data: competitions, isLoading, error } = useCompetitions();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  const groupedCompetitions = useMemo(() => {
    if (!competitions) return new Map();
    return groupCompetitions(competitions);
  }, [competitions]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedCompetitions;

    const filtered = new Map<string, Map<string, Competition[]>>();
    const term = searchTerm.toLowerCase();

    for (const [country, comps] of groupedCompetitions) {
      const matchingComps = new Map<string, Competition[]>();

      for (const [compName, seasons] of comps) {
        if (
          country.toLowerCase().includes(term) ||
          compName.toLowerCase().includes(term)
        ) {
          matchingComps.set(compName, seasons);
        }
      }

      if (matchingComps.size > 0) {
        filtered.set(country, matchingComps);
      }
    }

    return filtered;
  }, [groupedCompetitions, searchTerm]);

  const toggleCountry = (country: string) => {
    setExpandedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(country)) {
        next.delete(country);
      } else {
        next.add(country);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 bg-red-50 rounded ${className}`}>
        Failed to load competitions: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Competition list */}
      <div className="space-y-2">
        {Array.from(filteredGroups.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([country, comps]) => (
            <CountrySection
              key={country}
              country={country}
              competitions={comps}
              isExpanded={expandedCountries.has(country) || searchTerm.length > 0}
              onToggle={() => toggleCountry(country)}
            />
          ))}
      </div>

      {filteredGroups.size === 0 && (
        <div className="text-gray-500 text-center py-8">
          No competitions found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}

interface CountrySectionProps {
  country: string;
  competitions: Map<string, Competition[]>;
  isExpanded: boolean;
  onToggle: () => void;
}

function CountrySection({
  country,
  competitions,
  isExpanded,
  onToggle,
}: CountrySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">{country}</span>
          <span className="text-sm text-gray-400">
            ({competitions.size} competition{competitions.size !== 1 ? 's' : ''})
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t divide-y">
          {Array.from(competitions.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([compName, seasons]) => (
              <CompetitionItem key={compName} name={compName} seasons={seasons} />
            ))}
        </div>
      )}
    </div>
  );
}

interface CompetitionItemProps {
  name: string;
  seasons: Competition[];
}

function CompetitionItem({ name, seasons }: CompetitionItemProps) {
  const sortedSeasons = [...seasons].sort((a, b) =>
    b.season_name.localeCompare(a.season_name)
  );

  return (
    <div className="px-4 py-3">
      <div className="font-medium mb-2">{name}</div>
      <div className="flex flex-wrap gap-2">
        {sortedSeasons.map((season) => (
          <Link
            key={`${season.competition_id}-${season.season_id}`}
            to={`/competition/${season.competition_id}/season/${season.season_id}`}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors"
          >
            {season.season_name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CompetitionList;
