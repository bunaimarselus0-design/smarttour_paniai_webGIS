import React, { useState } from 'react';
import { Destination } from './types';
import { INITIAL_DESTINATIONS } from './constants';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recommendation from './pages/Recommendation';
import Admin from './pages/Admin';

function App() {
  // Simple state-based routing as requested (hash-like behavior)
  const [currentPage, setCurrentPage] = useState('home');
  // Lifted state for destinations to share between Admin (CRUD) and Public views
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home destinations={destinations} onNavigate={setCurrentPage} />;
      case 'recommendation':
        return <Recommendation destinations={destinations} />;
      case 'admin':
        return <Admin destinations={destinations} setDestinations={setDestinations} />;
      default:
        return <Home destinations={destinations} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="font-sans text-gray-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2 font-semibold">SmartTour Paniai &copy; 2025</p>
          <p className="text-gray-400 text-sm">Sistem Informasi Pariwisata Berbasis WebGIS & Content-Based Filtering</p>
          <p className="text-gray-500 text-xs mt-4">Proposal Skripsi oleh Marselus Bunai (NPM 22111100019)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
