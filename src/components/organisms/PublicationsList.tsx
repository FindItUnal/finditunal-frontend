import PublicationCard from './PublicationCard';
import { Item } from '../../types';
import { Package } from 'lucide-react';

interface PublicationsListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onGoDashboard?: () => void;
  onMarkClaimed?: (id: string) => void;
}

export default function PublicationsList({ items, onEdit, onDelete, onGoDashboard, onMarkClaimed }: PublicationsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center transition-colors">
        <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes publicaciones</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Comienza publicando objetos que hayas encontrado</p>
        <button onClick={() => onGoDashboard && onGoDashboard()} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105">Ir al Dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <PublicationCard key={it.id} item={it} onEdit={onEdit} onDelete={onDelete} onMarkClaimed={onMarkClaimed} />
      ))}
    </div>
  );
}
