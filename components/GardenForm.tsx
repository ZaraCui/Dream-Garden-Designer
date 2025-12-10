import React, { useState } from 'react';
import { GardenPreferences, GardenStyle, Sunlight, GardenSize } from '../types';
import { Leaf, Sun, Ruler, Palette, Thermometer, PenTool } from 'lucide-react';

interface GardenFormProps {
  onSubmit: (prefs: GardenPreferences) => void;
  isLoading: boolean;
}

export const GardenForm: React.FC<GardenFormProps> = ({ onSubmit, isLoading }) => {
  const [style, setStyle] = useState<GardenStyle>(GardenStyle.COTTAGE);
  const [sunlight, setSunlight] = useState<Sunlight>(Sunlight.FULL_SUN);
  const [size, setSize] = useState<GardenSize>(GardenSize.MEDIUM_YARD);
  const [hardinessZone, setHardinessZone] = useState('');
  const [colors, setColors] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ style, sunlight, size, hardinessZone, colors, extraNotes });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
      <div className="bg-green-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          Define Your Dream Garden
        </h2>
        <p className="text-green-100 mt-2">Tell us about your space and preferences.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Style */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4 text-green-600" /> Garden Style
            </label>
            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value as GardenStyle)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              {Object.values(GardenStyle).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-green-600" /> Garden Size
            </label>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value as GardenSize)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              {Object.values(GardenSize).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sunlight */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sun className="w-4 h-4 text-orange-500" /> Sunlight Conditions
            </label>
            <select 
              value={sunlight} 
              onChange={(e) => setSunlight(e.target.value as Sunlight)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              {Object.values(Sunlight).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

           {/* Hardiness Zone */}
           <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-500" /> Hardiness Zone (Optional)
            </label>
            <input 
              type="text"
              placeholder="e.g., 7b, 9a"
              value={hardinessZone}
              onChange={(e) => setHardinessZone(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Preferred Colors (Optional)</label>
            <input 
              type="text"
              placeholder="e.g., Purple and White, Sunset colors"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
        </div>

        {/* Extra Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
             <PenTool className="w-4 h-4 text-blue-500" /> Specific Features/Notes
          </label>
          <textarea 
            placeholder="e.g., I want a koi pond and a stone bench."
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all h-24 resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] ${
            isLoading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
          }`}
        >
          {isLoading ? 'Designing your garden...' : 'Generate My Dream Garden'}
        </button>
      </form>
    </div>
  );
};
