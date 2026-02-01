import React, { useState } from 'react';
import { Order, MenuItem, SpiceLevel } from '../types';
import { CheckCircle, Clock, AlertTriangle, ChefHat, Settings, User } from 'lucide-react';
import MenuManager from './MenuManager';

interface Props {
  orders: Order[];
  onCompleteOrder: (orderId: string) => void;
  menuItems: MenuItem[];
  onAddMenu: (item: MenuItem) => void;
  onUpdateMenu: (item: MenuItem) => void;
  onDeleteMenu: (id: string) => void;
}

const KitchenView: React.FC<Props> = ({ orders, onCompleteOrder, menuItems, onAddMenu, onUpdateMenu, onDeleteMenu }) => {
  const [showMenuManager, setShowMenuManager] = useState(false);
  const activeOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="space-y-6">
        {/* Kitchen Utility Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
            <h2 className="font-bold text-blue-900 flex items-center gap-2 text-lg">
                <ChefHat className="text-blue-500" />
                Kitchen Display System
            </h2>
            <button 
                onClick={() => setShowMenuManager(true)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
            >
                <Settings size={16} /> Manage Menu
            </button>
        </div>

        {/* Menu Manager Modal */}
        {showMenuManager && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMenuManager(false)} />
                <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                     <MenuManager 
                        items={menuItems}
                        onAdd={onAddMenu}
                        onUpdate={onUpdateMenu}
                        onDelete={onDeleteMenu}
                        onClose={() => setShowMenuManager(false)}
                     />
                </div>
            </div>
        )}

        {/* Orders Grid */}
        {activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={40} className="text-blue-200" />
                </div>
                <h2 className="text-2xl font-semibold text-blue-900">All caught up!</h2>
                <p>No pending orders in the kitchen.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 ring-1 ring-slate-100">
                    
                    {/* Ticket Header */}
                    <div className="bg-blue-900 text-white p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold">Table {order.tableNumber}</span>
                                <span className="text-xs bg-blue-700 px-2 py-1 rounded">#{order.id.slice(-4)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-mono text-blue-200">
                                <Clock size={14} />
                                {order.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                        {order.customerName && (
                            <div className="flex items-center gap-2 text-blue-200 text-sm border-t border-blue-800 pt-2">
                                <User size={14} />
                                {order.customerName}
                            </div>
                        )}
                    </div>

                    {/* Ticket Body */}
                    <div className="p-4 flex-grow space-y-4">
                        {order.items.map((item, idx) => {
                            const analysis = order.analysisResults?.[item.cartId];
                            const hasImportantNotes = item.customization.allergyNotes || item.customization.lowSalt || item.customization.lowSugar || item.customization.spiceLevel > 0;

                            return (
                                <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-lg text-slate-800">{item.quantity}x {item.menuItem.name}</span>
                                    </div>

                                    {/* Automated Kitchen Instructions from AI */}
                                    {analysis?.kitchenTicketSummary ? (
                                        <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 text-sm font-mono text-slate-900 font-bold uppercase">
                                            {analysis.kitchenTicketSummary}
                                        </div>
                                    ) : (
                                        /* Fallback Manual Instructions */
                                        hasImportantNotes && (
                                            <div className="mt-2 space-y-1">
                                                {item.customization.allergyNotes && (
                                                    <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-1.5 rounded uppercase text-sm">
                                                        <AlertTriangle size={16} />
                                                        ALLERGY: {item.customization.allergyNotes}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {item.customization.lowSalt && <span className="px-2 py-1 bg-slate-200 text-slate-800 font-bold text-xs rounded uppercase">NO SALT</span>}
                                                    {item.customization.lowSugar && <span className="px-2 py-1 bg-slate-200 text-slate-800 font-bold text-xs rounded uppercase">NO SUGAR</span>}
                                                    {item.customization.spiceLevel > 0 && (
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 font-bold text-xs rounded uppercase">
                                                            SPICE: {SpiceLevel[item.customization.spiceLevel]}
                                                        </span>
                                                    )}
                                                    {item.customization.specialRequests && (
                                                        <p className="w-full text-xs font-mono bg-slate-50 p-2 mt-1 border border-slate-100 text-slate-700 italic">
                                                            "{item.customization.specialRequests}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Ticket Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button 
                            onClick={() => onCompleteOrder(order.id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
                        >
                            <CheckCircle size={20} />
                            Mark Ready
                        </button>
                    </div>

                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default KitchenView;