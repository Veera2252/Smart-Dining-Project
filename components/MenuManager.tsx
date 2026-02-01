import React, { useState } from 'react';
import { MenuItem, DietaryTag } from '../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

interface Props {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onClose?: () => void; // Optional close for modal usage
}

const MenuManager: React.FC<Props> = ({ items, onAdd, onUpdate, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingItem({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      price: 0,
      image: 'https://picsum.photos/400/300',
      category: 'Mains',
      tags: [],
      calories: 0
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingItem.name || !editingItem.price) return;
    
    // Ensure tags is array
    const finalItem = {
        ...editingItem,
        price: Number(editingItem.price),
        tags: Array.isArray(editingItem.tags) ? editingItem.tags : [] 
    } as MenuItem;

    if (items.some(i => i.id === finalItem.id)) {
        onUpdate(finalItem);
    } else {
        onAdd(finalItem);
    }
    setIsEditing(false);
    setEditingItem({});
  };

  const handleTagToggle = (tag: DietaryTag) => {
    setEditingItem(prev => {
        const currentTags = prev.tags || [];
        if (currentTags.includes(tag)) {
            return { ...prev, tags: currentTags.filter(t => t !== tag) };
        } else {
            return { ...prev, tags: [...currentTags, tag] };
        }
    });
  };

  if (isEditing) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-blue-50 pb-4">
                <h3 className="text-xl font-bold text-blue-900">{items.some(i => i.id === editingItem.id) ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                        <input 
                            type="text" 
                            value={editingItem.name || ''} 
                            onChange={e => setEditingItem(prev => ({...prev, name: e.target.value}))}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            value={editingItem.description || ''} 
                            onChange={e => setEditingItem(prev => ({...prev, description: e.target.value}))}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                            <input 
                                type="number" 
                                value={editingItem.price || ''} 
                                onChange={e => setEditingItem(prev => ({...prev, price: parseFloat(e.target.value)}))}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={editingItem.category || 'Mains'} 
                                onChange={e => setEditingItem(prev => ({...prev, category: e.target.value}))}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Appetizers">Appetizers</option>
                                <option value="Mains">Mains</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={editingItem.image || ''} 
                                onChange={e => setEditingItem(prev => ({...prev, image: e.target.value}))}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {editingItem.image && (
                                <img src={editingItem.image} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-200" />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Dietary Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(DietaryTag).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        (editingItem.tags || []).includes(tag) 
                                        ? 'bg-blue-100 border-blue-200 text-blue-800 font-bold' 
                                        : 'bg-white border-slate-200 text-slate-600'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
                >
                    <Save size={18} /> Save Item
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon size={20} className="text-blue-500"/>
            Menu Management
        </h3>
        <div className="flex gap-2">
            {onClose && (
                <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg md:hidden">
                    <X size={20} />
                </button>
            )}
            <button 
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
            >
                <Plus size={16} /> Add Item
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30">
                        <td className="px-4 py-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                            <p className="font-bold text-slate-900 truncate">{item.name}</p>
                            <p className="text-slate-500 text-xs truncate">{item.description}</p>
                        </td>
                         <td className="px-4 py-3">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{item.category}</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">₹{item.price}</td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => onDelete(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default MenuManager;