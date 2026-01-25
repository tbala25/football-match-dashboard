import { CompetitionList } from '../components/browser';

export function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Football Match Dashboard
        </h1>
        <p className="text-gray-600">
          Explore match data from StatsBomb Open Data. Select a competition and season
          to view available matches.
        </p>
      </div>

      <CompetitionList />
    </div>
  );
}

export default HomePage;
