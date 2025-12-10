import React, { useState } from 'react';
import { GardenForm } from './components/GardenForm';
import { GardenResult } from './components/GardenResult';
import { GardenPreferences, GardenPlan } from './types';
import { generateGardenPlan, generateGardenVisual } from './services/geminiService';
import { Flower } from 'lucide-react';

function App() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [preferences, setPreferences] = useState<GardenPreferences | null>(null);
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [gardenImage, setGardenImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (prefs: GardenPreferences) => {
    setPreferences(prefs);
    setStep('loading');
    setError(null);

    try {
      // Execute both generation tasks in parallel for speed
      const [plan, image] = await Promise.all([
        generateGardenPlan(prefs),
        generateGardenVisual(prefs)
      ]);

      setGardenPlan(plan);
      setGardenImage(image);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("We encountered an issue designing your garden. Please check your connection and try again.");
      setStep('form');
    }
  };

  const handleReset = () => {
    setGardenPlan(null);
    setGardenImage(null);
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-gray-800">
      
      {/* Navbar */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
                <Flower className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900 tracking-tight">DreamGarden AI</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {step === 'form' && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Design Your <span className="text-green-600">Perfect Sanctuary</span>
              </h1>
              <p className="text-lg text-gray-600">
                Describe your dream space, and let our AI generate a professional layout, plant selection, and visualization in seconds.
              </p>
            </div>
            {error && (
              <div className="w-full max-w-2xl mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                {error}
              </div>
            )}
            <GardenForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 animate-fade-in">
             <div className="relative">
                <div className="w-24 h-24 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Flower className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold text-gray-800">Cultivating Your Design...</h3>
               <p className="text-gray-500 mt-2">Analyzing sunlight, selecting plants, and rendering visuals.</p>
               <p className="text-xs text-green-600 mt-4 font-mono uppercase tracking-widest">Generating with Gemini 2.5</p>
             </div>
          </div>
        )}

        {step === 'result' && gardenPlan && gardenImage && (
          <GardenResult 
            plan={gardenPlan} 
            initialImage={gardenImage} 
            onReset={handleReset} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} DreamGarden AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
