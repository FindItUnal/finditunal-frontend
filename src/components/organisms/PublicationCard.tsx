import { Edit2, Trash2, MapPin, Calendar } from 'lucide-react';
import { Item } from '../../types';
import Button from '../atoms/Button';

interface PublicationCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onMarkClaimed?: (id: string) => void;
}

export default function PublicationCard({ item, onEdit, onDelete, onMarkClaimed }: PublicationCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-24 h-48 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 mt-3 md:mt-0 md:ml-2">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              item.status === 'claimed' 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : item.status === 'found'
                ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                : 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
            }`}>
              {item.status === 'claimed' ? 'Entregado' : item.status === 'found' ? 'Encontrado' : 'Perdido'}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {item.location}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(item.date).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {item.status !== 'claimed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onMarkClaimed && onMarkClaimed(item.id)}
            >
              Marcar como entregado
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(item)} className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900 rounded-lg transition-colors">
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
