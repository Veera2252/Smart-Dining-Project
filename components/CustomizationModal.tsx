import React, { useState, useEffect } from 'react';
import { MenuItem, CustomizationOptions, SpiceLevel } from '../types';
import { X, Flame, Check, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onConfirm: (customization: CustomizationOptions, quantity: number) => void;
}

const CustomizationModal: React.FC<Props> = ({ isOpen, onClose, item, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<CustomizationOptions>({
    lowSalt: false,
    lowSugar: false,
    lowOil: false,
    spiceLevel: SpiceLevel.NONE,
    allergyNotes: '',
    specialRequests: ''
  });

  // Reset state when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setOptions({
        lowSalt: false,
        lowSugar: false,
        lowOil: false,
        spiceLevel: SpiceLevel.NONE,
        allergyNotes: '',
        specialRequests: ''
      });
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const toggleOption = (key: keyof Pick<CustomizationOptions, 'lowSalt' | 'lowSugar' | 'lowOil'>) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSpiceChange = (level: number) => {
    setOptions(prev => ({ ...prev, spiceLevel: level as SpiceLevel }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
                <h2 className="font-bold text-xl text-slate-900">{item.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>₹{item.price} base price</span>
                    {item.calories && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                                <Flame size={12} className="text-orange-500" /> 
                                {item.calories} kcal
                            </span>
                        </>
                    )}
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={24} />
            </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-8">
            
            {/* Health Toggles */}
            <section>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => toggleOption('lowSalt')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${options.lowSalt ? 'bg-green-100 border-green-200 text-green-800' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
                    >
                        {options.lowSalt && <Check size={14} />} Low Salt
                    </button>
                    <button 
                        onClick={() => toggleOption('lowSugar')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${options.lowSugar ? 'bg-green-100 border-green-200 text-green-800' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
                    >
                        {options.lowSugar && <Check size={14} />} Low Sugar
                    </button>
                    <button 
                        onClick={() => toggleOption('lowOil')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${options.lowOil ? 'bg-green-100 border-green-200 text-green-800' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
                    >
                         {options.lowOil && <Check size={14} />} Less Oil
                    </button>
                </div>
            </section>

            {/* Spice Level */}
            <section>
                 <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    Spice Level <span className="text-orange-500 text-xs font-normal">(Adjust to taste)</span>
                </h3>
                <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <button
                            key={level}
                            onClick={() => handleSpiceChange(level)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${options.spiceLevel === level ? 'bg-white shadow-sm text-orange-600 border border-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {level === 0 ? 'None' : (
                                <div className="flex justify-center">
                                    {Array.from({length: level}).map((_, i) => (
                                        <Flame key={i} size={14} className={options.spiceLevel === level ? "fill-orange-500" : ""} />
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Allergies & Notes */}
            <section className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        Allergies
                    </label>
                    <textarea 
                        value={options.allergyNotes}
                        onChange={(e) => setOptions(prev => ({...prev, allergyNotes: e.target.value}))}
                        placeholder="e.g. Peanut, Shellfish, Gluten..."
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
                <div>
                     <label className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 block">
                        Chef Instructions
                    </label>
                    <textarea 
                        value={options.specialRequests}
                        onChange={(e) => setOptions(prev => ({...prev, specialRequests: e.target.value}))}
                        placeholder="Any other specific preferences?"
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
            </section>

             {/* Quantity */}
             <section className="flex items-center justify-between py-2">
                <span className="font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-1">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-blue-600 font-bold"
                    >-</button>
                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-blue-600 font-bold"
                    >+</button>
                </div>
            </section>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-2xl">
            <button 
                onClick={() => onConfirm(options, quantity)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
            >
                Add to Order - ₹{(item.price * quantity).toFixed(2)}
            </button>
        </div>

      </div>
    </div>
  );
};

export default CustomizationModal;