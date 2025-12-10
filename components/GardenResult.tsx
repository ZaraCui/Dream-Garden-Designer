import React, { useState } from 'react';
import { GardenPlan } from '../types';
import { Download, Wand2, RefreshCw, Sparkles, Map, Sprout, Info } from 'lucide-react';
import { editGardenVisual } from '../services/geminiService';

interface GardenResultProps {
  plan: GardenPlan;
  initialImage: string;
  onReset: () => void;
}

export const GardenResult: React.FC<GardenResultProps> = ({ plan, initialImage, onReset }) => {
  const [currentImage, setCurrentImage] = useState<string>(initialImage);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    
    setIsEditing(true);
    setEditError(null);
    try {
      const newImage = await editGardenVisual(currentImage, editPrompt);
      setCurrentImage(newImage);
      setEditPrompt('');
    } catch (err) {
      setEditError("Failed to edit image. Please try a different prompt.");
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-green-50">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
        >
          <RefreshCw className="w-4 h-4" /> Start Over
        </button>
        <h1 className="text-xl font-bold text-green-800 hidden md:block">{plan.title}</h1>
        <button 
            className="flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 font-medium px-4 py-2 rounded-lg transition-colors"
            onClick={() => {
                const link = document.createElement('a');
                link.href = currentImage;
                link.download = 'dream-garden.png';
                link.click();
            }}
        >
          <Download className="w-4 h-4" /> Save Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Visual Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 min-h-[400px]">
            <img 
              src={currentImage} 
              alt="Garden Visual" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm z-10">
                <Sparkles className="w-12 h-12 mb-4 animate-spin-slow text-yellow-300" />
                <p className="text-xl font-medium animate-pulse">Applying your changes...</p>
              </div>
            )}
          </div>

          {/* Magic Edit Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" /> 
              AI Visual Editor (Nano Banana)
            </h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Ex: 'Add a stone fountain in the center', 'Make it sunset'"
                className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <button 
                onClick={handleEdit}
                disabled={isEditing || !editPrompt.trim()}
                className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md
                  ${isEditing || !editPrompt.trim() 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg active:scale-95'}`}
              >
                {isEditing ? 'Editing...' : 'Generate Edit'}
              </button>
            </div>
            {editError && <p className="text-red-500 text-sm mt-2">{editError}</p>}
            <p className="text-xs text-gray-400 mt-2">Powered by Gemini 2.5 Flash Image. Describe what you want to change or add.</p>
          </div>
        </div>

        {/* Plan Details Column */}
        <div className="space-y-6">
          
          {/* Overview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-green-50">
            <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" /> Overview
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {plan.description}
            </p>
          </div>

          {/* Plant List */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-green-50">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5" /> Recommended Plants
            </h3>
            <div className="space-y-4">
              {plan.plants.map((plant, idx) => (
                <div key={idx} className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-green-900">{plant.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      plant.careLevel === 'Easy' ? 'bg-green-200 text-green-800' :
                      plant.careLevel === 'Moderate' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {plant.careLevel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{plant.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Tips */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl shadow-md text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Map className="w-5 h-5" /> Layout Tips
            </h3>
            <ul className="space-y-3">
              {plan.layoutTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm items-start">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="opacity-90">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
