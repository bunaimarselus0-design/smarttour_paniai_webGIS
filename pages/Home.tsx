import React, { useState, useMemo } from 'react';
import MapComponent from '../components/MapComponent';
import { Destination, Category } from '../types';
import { ArrowRight, Filter } from 'lucide-react';

interface HomeProps {
  destinations: Destination[];
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ destinations, onNavigate }) => {
  const [activeFilters, setActiveFilters] = useState<Category[]>([Category.ALAM, Category.BUDAYA]);

  const toggleFilter = (category: Category) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredDestinations = useMemo(() => 
    destinations.filter(d => activeFilters.includes(d.category)),
  [destinations, activeFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-paniai-900 text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Jelajahi Keindahan <span className="text-paniai-500">Paniai</span>
            </h1>
            <p className="text-lg text-paniai-100 mb-8 leading-relaxed">
              Temukan destinasi wisata alam dan budaya terbaik di Jantung Papua Tengah melalui sistem informasi geografis yang interaktif.
            </p>
            <button 
              onClick={() => onNavigate('recommendation')}
              className="inline-flex items-center bg-paniai-500 hover:bg-paniai-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Cari Rekomendasi
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-4 border-paniai-800">
               <img 
                 src="https://picsum.photos/seed/paniaihero/800/450" 
                 alt="Paniai Landscape" 
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-2xl font-bold text-white drop-shadow-md">WebGIS Paniai</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-grow bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto h-[600px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">Peta Sebaran Wisata</h2>
            </div>
            <div className="flex gap-4 text-sm">
              <button 
                onClick={() => toggleFilter(Category.ALAM)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  activeFilters.includes(Category.ALAM) 
                    ? 'bg-green-100 text-green-800 ring-2 ring-green-500' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${activeFilters.includes(Category.ALAM) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                <span>Wisata Alam</span>
              </button>
              
              <button 
                onClick={() => toggleFilter(Category.BUDAYA)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  activeFilters.includes(Category.BUDAYA) 
                    ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-500' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${activeFilters.includes(Category.BUDAYA) ? 'bg-orange-600' : 'bg-gray-400'}`}></div>
                <span>Wisata Budaya</span>
              </button>
            </div>
          </div>
          <div className="flex-grow relative">
             <MapComponent destinations={filteredDestinations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;