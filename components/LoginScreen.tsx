import React, { useState } from 'react';
import { QrCode, Camera, ArrowRight, User, UtensilsCrossed, Lock } from 'lucide-react';

interface Props {
  onLogin: (table: string, name: string) => void;
  onStaffAccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin, onStaffAccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'scan' | 'details'>('scan');
  const [table, setTable] = useState('');
  const [name, setName] = useState('');

  const handleSimulateScan = () => {
    setIsScanning(true);
    // Simulate camera initialization and scanning delay
    setTimeout(() => {
      setIsScanning(false);
      // Mock finding a table number from QR
      setTable((Math.floor(Math.random() * 15) + 1).toString());
      setStep('details');
    }, 2500);
  };

  const handleManualEntry = () => {
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (table && name) {
      onLogin(table, name);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

      <div className="z-10 w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Area */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20 shadow-xl">
            <UtensilsCrossed size={48} className="text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-center tracking-tight">DineRight</h1>
        <p className="text-blue-200 mb-10 text-center">Scan your table QR to start ordering</p>

        {step === 'scan' ? (
          <div className="w-full space-y-4">
             {/* Scanner Box */}
             <div className="relative aspect-square bg-black/20 rounded-3xl border-2 border-dashed border-white/30 flex items-center justify-center mb-6 overflow-hidden">
                {isScanning ? (
                    <>
                        <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center">
                             <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                             </div>
                             <p className="mt-4 font-mono text-sm animate-pulse">Detecting QR Code...</p>
                        </div>
                        {/* Mock Camera Feed Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div> 
                    </>
                ) : (
                    <div className="text-center p-6">
                        <QrCode size={80} className="mx-auto text-white/50 mb-4" />
                        <p className="text-sm text-blue-200">Point camera at table QR code</p>
                    </div>
                )}
             </div>

             <button 
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="w-full bg-white text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
             >
                <Camera size={20} />
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
             </button>

             <button 
                onClick={handleManualEntry}
                disabled={isScanning}
                className="w-full bg-transparent border border-white/30 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
             >
                Enter Table Number Manually
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-6">
             <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Table Number</label>
                <input 
                    type="text" 
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold text-lg text-center tracking-widest"
                    placeholder="e.g. 5"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Your Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="John Doe"
                    />
                </div>
             </div>

             <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 mt-4"
             >
                Start Ordering <ArrowRight size={20} />
             </button>

             <button 
                type="button"
                onClick={() => setStep('scan')}
                className="w-full text-center text-sm text-blue-200 hover:text-white"
             >
                Cancel
             </button>
          </form>
        )}
        
        <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-blue-400">© 2024 DineRight. AI-Powered Dining.</p>
            <button 
                onClick={onStaffAccess}
                className="text-[10px] text-blue-500/50 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
                <Lock size={10} /> Staff Access
            </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;