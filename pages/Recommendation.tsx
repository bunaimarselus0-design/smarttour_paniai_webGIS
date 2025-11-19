import React, { useState, useEffect } from 'react';
import { Category, Destination, UserPreference, RecommendationResult } from '../types';
import { AVAILABLE_FEATURES } from '../constants';
import { calculateRecommendations } from '../services/cbfService';
import { Check, MapPin, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import MapComponent from '../components/MapComponent';

interface RecommendationProps {
  destinations: Destination[];
}

const Recommendation: React.FC<RecommendationProps> = ({ destinations }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreference>({
    preferredCategories: [],
    preferredFeatures: []
  });
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-3.9055, 136.3566]);

  const toggleCategory = (cat: Category) => {
    setPreferences(prev => {
      const exists = prev.preferredCategories.includes(cat);
      return {
        ...prev,
        preferredCategories: exists 
          ? prev.preferredCategories.filter(c => c !== cat)
          : [...prev.preferredCategories, cat]
      };
    });
  };

  const toggleFeature = (feat: string) => {
    setPreferences(prev => {
      const exists = prev.preferredFeatures.includes(feat);
      return {
        ...prev,
        preferredFeatures: exists
          ? prev.preferredFeatures.filter(f => f !== feat)
          : [...prev.preferredFeatures, feat]
      };
    });
  };

  const handleCalculate = () => {
    const recs = calculateRecommendations(destinations, preferences);
    const topRecs = recs.slice(0, 3);
    setResults(topRecs);
    
    // Center map on the first result
    if (topRecs.length > 0) {
      setMapCenter([topRecs[0].latitude, topRecs[0].longitude]);
    }
    
    setStep(2);
    setAiSuggestion('');
  };

  const handleGetAiAdvice = async (destinationName: string) => {
    if (!process.env.API_KEY) {
      setAiSuggestion("API Key belum dikonfigurasi. Tambahkan API_KEY ke variabel environment.");
      return;
    }

    setLoadingAi(true);
    setAiSuggestion('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = "gemini-2.5-flash";
      const prompt = `Saya seorang turis di Kabupaten Paniai, Papua. Saya tertarik mengunjungi ${destinationName}. 
      Berikan tips perjalanan singkat (maksimal 3 kalimat) dan satu aktivitas menarik yang unik di sana.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      setAiSuggestion(response.text || "Tidak dapat memuat saran saat ini.");
    } catch (error) {
      console.error(error);
      setAiSuggestion("Maaf, gagal menghubungi asisten AI. Periksa koneksi atau API Key.");
    } finally {
      setLoadingAi(false);
    }
  };

  const reset = () => {
    setStep(1);
    setPreferences({ preferredCategories: [], preferredFeatures: [] });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Rekomendasi Wisata Cerdas</h1>
          <p className="text-gray-600 mt-2">Sistem Pendukung Keputusan berbasis WebGIS & Content-Based Filtering</p>
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">1. Pilih Kategori Minat Anda</h2>
            <div className="flex gap-4 mb-8">
              {Object.values(Category).map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex-1 py-4 px-4 rounded-lg border-2 transition-all text-center font-medium ${
                    preferences.preferredCategories.includes(cat)
                      ? 'border-paniai-500 bg-paniai-50 text-paniai-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">2. Pilih Fitur Yang Dicari</h2>
            <div className="flex flex-wrap gap-3 mb-10">
              {AVAILABLE_FEATURES.map(feat => (
                <button
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    preferences.preferredFeatures.includes(feat)
                      ? 'bg-paniai-600 text-white border-paniai-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {feat.charAt(0).toUpperCase() + feat.slice(1)}
                  {preferences.preferredFeatures.includes(feat) && <Check size={14} className="inline ml-2"/>}
                </button>
              ))}
            </div>

            <button
              onClick={handleCalculate}
              disabled={preferences.preferredCategories.length === 0 && preferences.preferredFeatures.length === 0}
              className="w-full bg-paniai-600 hover:bg-paniai-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Temukan Destinasi
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-6 h-full">
            
            {/* Left Column: List */}
            <div className="lg:w-1/2 space-y-6 order-2 lg:order-1">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-gray-800">Top 3 Rekomendasi</h2>
                 <button onClick={reset} className="flex items-center gap-1 text-paniai-600 font-medium hover:underline text-sm">
                    <ArrowLeft size={16} /> Ulangi
                 </button>
              </div>
              
              <div className="space-y-4">
                {results.map((dest, index) => (
                  <div 
                    key={dest.id} 
                    onClick={() => setMapCenter([dest.latitude, dest.longitude])}
                    className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer group"
                  >
                     <div className="relative h-48">
                       <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                       <div className="absolute top-0 left-0 bg-gradient-to-b from-black/60 to-transparent w-full p-3 flex justify-between items-start">
                         <div className="bg-paniai-500 text-white px-2 py-1 rounded text-xs font-bold">
                            #{index + 1}
                         </div>
                         <div className="bg-white/90 text-paniai-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                           Kecocokan: {Math.round(dest.score * 100)}%
                         </div>
                       </div>
                     </div>
                     
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold text-gray-900">{dest.name}</h3>
                         <span className={`text-xs px-2 py-1 rounded font-semibold ${
                           dest.category === Category.ALAM ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                         }`}>
                           {dest.category}
                         </span>
                       </div>
                       
                       <p className="text-gray-600 text-sm line-clamp-2 mb-3">{dest.description}</p>
                       
                       <div className="flex flex-wrap gap-1.5 mb-4">
                         {dest.features.map(f => (
                           <span key={f} className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wide px-2 py-1 rounded">
                             {f}
                           </span>
                         ))}
                       </div>
                       
                       <div className="pt-3 border-t flex justify-between items-center">
                          <div className="text-yellow-500 font-bold text-sm">★ {dest.rating}</div>
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGetAiAdvice(dest.name);
                            }}
                            className="flex items-center gap-1.5 text-paniai-600 hover:text-paniai-800 text-sm font-bold transition-colors bg-paniai-50 px-3 py-1.5 rounded-lg hover:bg-paniai-100"
                          >
                            <Sparkles size={16} />
                            Tanya AI
                          </button>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
              
              {/* AI Suggestion Box */}
              {(loadingAi || aiSuggestion) && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold mb-2">
                    <Sparkles size={20} />
                    <h3>SmartTour AI Assistant</h3>
                  </div>
                  {loadingAi ? (
                    <div className="flex items-center gap-2 text-gray-600 py-2">
                      <Loader2 className="animate-spin" size={18} />
                      Sedang menganalisis {results.find(r => r.name)?.name || 'destinasi'}...
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{aiSuggestion}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Map */}
            <div className="lg:w-1/2 order-1 lg:order-2 h-[400px] lg:h-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 sticky top-20">
               <MapComponent destinations={results} center={mapCenter} zoom={12} />
               <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow text-xs text-gray-600 z-[400]">
                 Klik pada kartu di sebelah kiri untuk memusatkan peta pada destinasi tersebut.
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendation;