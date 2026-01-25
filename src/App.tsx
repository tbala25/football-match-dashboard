import { Routes, Route } from 'react-router-dom';
import { HomePage, SeasonPage, MatchPage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-green-600"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="45" fill="currentColor" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#fff" strokeWidth="3" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#fff" strokeWidth="3" />
            </svg>
            <span className="text-xl font-bold text-gray-900">
              Football Match Dashboard
            </span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/competition/:competitionId/season/:seasonId"
            element={<SeasonPage />}
          />
          <Route path="/match/:matchId" element={<MatchPage />} />
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
              className="text-blue-600 hover:underline"
            >
              StatsBomb Open Data
            </a>
          </p>
          <p className="mt-1">
            Football Match Dashboard - Built with React, TypeScript, and D3.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
