import React from 'react';
import { MenuItem, DietaryTag } from '../types';
import { Plus, Flame } from 'lucide-react';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<Props> = ({ item, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all flex flex-col h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
            {item.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-black/70 text-white backdrop-blur-sm">
                    {tag}
                </span>
            ))}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg text-slate-900 leading-tight">{item.name}</h3>
            <span className="font-bold text-blue-600">₹{item.price}</span>
        </div>
        
        {item.calories && (
           <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-3">
              <Flame size={12} className="text-orange-400" />
              {item.calories} kcal
           </div>
        )}
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">{item.description}</p>
        
        <button 
            onClick={() => onAdd(item)}
            className="w-full mt-auto flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md shadow-blue-100"
        >
            <Plus size={16} />
            Customize & Add
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;