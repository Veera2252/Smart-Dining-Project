import React, { useMemo } from 'react';
import { Order, MenuItem } from '../types';
import { TrendingUp, DollarSign, ShoppingBag, Activity, Utensils } from 'lucide-react';
import MenuManager from './MenuManager';

interface Props {
  orders: Order[];
  menuItems: MenuItem[];
  onAddMenu: (item: MenuItem) => void;
  onUpdateMenu: (item: MenuItem) => void;
  onDeleteMenu: (id: string) => void;
}

const AdminDashboard: React.FC<Props> = ({ orders, menuItems, onAddMenu, onUpdateMenu, onDeleteMenu }) => {
  // Calculate Analytics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.items.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
    }, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Customization Trends
    const trends = {
      lowSalt: 0,
      lowSugar: 0,
      lowOil: 0,
      allergies: 0,
      spicy: 0
    };

    const itemPopularity: Record<string, number> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        // Trends
        if (item.customization.lowSalt) trends.lowSalt++;
        if (item.customization.lowSugar) trends.lowSugar++;
        if (item.customization.lowOil) trends.lowOil++;
        if (item.customization.allergyNotes) trends.allergies++;
        if (item.customization.spiceLevel > 0) trends.spicy++;

        // Popularity
        itemPopularity[item.menuItem.name] = (itemPopularity[item.menuItem.name] || 0) + item.quantity;
      });
    });

    const sortedPopularity = Object.entries(itemPopularity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return { totalOrders, totalRevenue, avgOrderValue, trends, sortedPopularity };
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-blue-900">Admin Dashboard</h2>
            <p className="text-slate-500 text-sm">Real-time insights and system management.</p>
        </div>
        <div className="text-xs font-mono bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
            Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue.toFixed(2)}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalOrders}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-slate-900">₹{stats.avgOrderValue.toFixed(2)}</h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dietary Trends Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Activity size={20} className="text-blue-500" />
                <h3 className="font-bold text-slate-900">Health & Dietary Trends</h3>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span>Allergy Alerts</span>
                        <span className="font-bold">{stats.trends.allergies}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.trends.allergies / (stats.totalOrders || 1)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Low Salt Requests</span>
                        <span className="font-bold">{stats.trends.lowSalt}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.trends.lowSalt / (stats.totalOrders || 1)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500"></span>Low Sugar Requests</span>
                        <span className="font-bold">{stats.trends.lowSugar}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(stats.trends.lowSugar / (stats.totalOrders || 1)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Spicy Preferences</span>
                        <span className="font-bold">{stats.trends.spicy}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(stats.trends.spicy / (stats.totalOrders || 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Top Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Utensils size={20} className="text-blue-500" />
                <h3 className="font-bold text-slate-900">Most Popular Dishes</h3>
            </div>
            
            <div className="space-y-4">
                {stats.sortedPopularity.length > 0 ? (
                    stats.sortedPopularity.map(([name, count], index) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {index + 1}
                                </span>
                                <span className="font-medium text-slate-700">{name}</span>
                            </div>
                            <span className="font-bold text-slate-900">{count} sold</span>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-400 text-center py-8">No sales data yet.</div>
                )}
            </div>
        </div>
      </div>

      {/* Menu Management Section */}
      <section>
          <MenuManager 
            items={menuItems} 
            onAdd={onAddMenu} 
            onUpdate={onUpdateMenu} 
            onDelete={onDeleteMenu} 
          />
      </section>

      {/* Recent Activity Log */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">Recent Order Activity</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg">Time</th>
                        <th className="px-4 py-3">Table</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right rounded-r-lg">Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice().reverse().slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-slate-500">
                                {order.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="px-4 py-3 font-medium">Table {order.tableNumber}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">{order.items.length} items</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;