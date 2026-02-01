import React, { useState } from 'react';
import { OrderItem, AiAnalysisResult } from '../types';
import { Trash2, Sparkles, CheckCircle, AlertOctagon, Loader2, AlertTriangle, X } from 'lucide-react';
import { analyzeOrderRisk } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onRemove: (cartId: string) => void;
  onClear: () => void;
  onPlaceOrder: (items: OrderItem[], analysis: Record<string, AiAnalysisResult>) => void;
}

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, cart, onRemove, onClear, onPlaceOrder }) => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AiAnalysisResult>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const handleDismissWarning = (cartId: string) => {
    setDismissedWarnings(prev => {
        const newSet = new Set(prev);
        newSet.add(cartId);
        return newSet;
    });
  };

  const handleVerifyOrder = async () => {
    setIsAnalysing(true);
    const newResults: Record<string, AiAnalysisResult> = {};

    // Analyze each item that has significant customizations
    for (const item of cart) {
        if (item.customization.allergyNotes || item.customization.lowSalt || item.customization.lowSugar || item.customization.specialRequests || item.customization.spiceLevel > 0) {
            // Check if we already have a result to avoid re-fetching
            if (analysisResults[item.cartId]) {
                newResults[item.cartId] = analysisResults[item.cartId];
                continue;
            }
            const result = await analyzeOrderRisk(item.menuItem, item.customization);
            newResults[item.cartId] = result;
        }
    }
    setAnalysisResults(prev => ({ ...prev, ...newResults }));
    setIsAnalysing(false);
  };

  const handleSubmitToKitchen = () => {
    // Send data to parent
    onPlaceOrder(cart, analysisResults);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
      return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle size={48} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Received!</h2>
             <p className="text-slate-500 mb-8 max-w-md">The kitchen has received your structured preferences. Thank you for helping us serve you better.</p>
             
             <div className="w-full max-w-md bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-left font-mono text-xs text-slate-600 mb-8">
                <p className="font-bold border-b border-slate-200 pb-2 mb-2 text-center">KITCHEN TICKET #{(Math.random() * 1000).toFixed(0)}</p>
                {cart.map(item => (
                    <div key={item.cartId} className="mb-2">
                        <div className="flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                        </div>
                        {analysisResults[item.cartId]?.kitchenTicketSummary ? (
                            <p className="text-slate-900 font-bold ml-4">
                                &gt; {analysisResults[item.cartId].kitchenTicketSummary}
                            </p>
                        ) : (
                            // Fallback if AI wasn't run or didn't return ticket
                            (item.customization.allergyNotes || item.customization.lowSalt || item.customization.lowSugar || item.customization.spiceLevel > 0) && (
                                <p className="text-slate-900 font-bold ml-4">
                                    &gt; {item.customization.lowSalt ? 'NO SALT ' : ''}
                                    {item.customization.allergyNotes ? `ALLERGY: ${item.customization.allergyNotes}` : ''}
                                </p>
                            )
                        )}
                    </div>
                ))}
             </div>

             <button 
                onClick={() => {
                    onClear();
                    setIsSubmitted(false);
                    onClose();
                    setAnalysisResults({});
                    setDismissedWarnings(new Set());
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
                Start New Order
             </button>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <h2 className="font-bold text-xl text-slate-800">Your Order</h2>
            <button onClick={onClose} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full">Close</button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-6">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                cart.map((item) => {
                    const analysis = analysisResults[item.cartId];
                    const hasCustoms = item.customization.lowSalt || item.customization.lowSugar || item.customization.lowOil || item.customization.spiceLevel > 0 || item.customization.allergyNotes || item.customization.specialRequests;
                    
                    const hasAllergy = !!item.customization.allergyNotes;
                    const isWarningDismissed = dismissedWarnings.has(item.cartId);

                    return (
                        <div key={item.cartId} className="border-b border-slate-100 pb-4 last:border-0">
                            {/* Prominent Allergy Warning */}
                            {hasAllergy && !isWarningDismissed && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex items-start justify-between animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                                    <div className="flex gap-2.5">
                                        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="text-sm font-bold text-red-700">Allergy Alert Included</p>
                                            <p className="text-xs text-red-600 mt-0.5 leading-snug">
                                                Kitchen will be notified about: <span className="font-bold">"{item.customization.allergyNotes}"</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDismissWarning(item.cartId)} 
                                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-100 rounded"
                                        aria-label="Dismiss warning"
                                    >
                                        <X size={16}/>
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-slate-800">{item.menuItem.name}</h3>
                                <span className="font-medium text-blue-600">₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-slate-500 mb-2">Qty: {item.quantity}</div>
                            
                            {/* Customization Chips */}
                            {hasCustoms && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {item.customization.lowSalt && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Low Salt</span>}
                                    {item.customization.lowSugar && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Low Sugar</span>}
                                    {item.customization.spiceLevel > 0 && <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">Spice Lvl {item.customization.spiceLevel}</span>}
                                    {item.customization.allergyNotes && <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">Allergy: {item.customization.allergyNotes}</span>}
                                </div>
                            )}

                            {/* AI Warning/Success Message */}
                            {analysis && (
                                <div className={`text-xs p-2 rounded-lg mt-2 flex gap-2 items-start ${analysis.safe ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                    {analysis.safe ? <Sparkles size={14} className="mt-0.5 shrink-0" /> : <AlertOctagon size={14} className="mt-0.5 shrink-0" />}
                                    <p>{analysis.message}</p>
                                </div>
                            )}

                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={() => onRemove(item.cartId)}
                                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

        {cart.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex justify-between font-bold text-lg text-slate-900 mb-2">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {/* AI Verify Button */}
                <button 
                    onClick={handleVerifyOrder}
                    disabled={isAnalysing}
                    className="w-full bg-white border border-indigo-200 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                    {isAnalysing ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18} />}
                    {isAnalysing ? 'Chef AI is Checking...' : 'Verify Dietary Safety with AI'}
                </button>

                {/* Checkout Button */}
                <button 
                    onClick={handleSubmitToKitchen}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    Place Order
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;