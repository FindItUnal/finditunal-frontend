import { Item } from '../../types';
import ItemCard from './ItemCard';

export interface ItemGridProps {
  items: Item[];
  onItemOpen: (id: string) => void;
  onItemMessage: (id: string) => void;
  onItemReport: (id: string) => void;
  onItemDelete?: (id: string) => void;
}

export default function ItemGrid({ items, onItemOpen, onItemMessage, onItemReport, onItemDelete }: ItemGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onOpen={onItemOpen}
          onMessage={onItemMessage}
          onReport={onItemReport}
          onDelete={onItemDelete}
        />
      ))}
    </div>
  );
}
