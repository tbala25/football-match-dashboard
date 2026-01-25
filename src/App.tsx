import { Routes, Route } from 'react-router-dom';
import { HomePage, SeasonPage, MatchPageNew } from './pages';
import { Header } from './components/layout/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header />

      {/* Main content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/competition/:competitionId/season/:seasonId"
            element={<SeasonPage />}
          />
          <Route path="/match/:matchId" element={<MatchPageNew />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Data provided by{' '}
            <a
              href="https://github.com/statsbomb/open-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              StatsBomb Open Data
            </a>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Football Match Dashboard - Built with React, TypeScript, and D3.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
