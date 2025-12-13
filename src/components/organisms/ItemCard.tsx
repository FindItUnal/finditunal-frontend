import { Card, Badge, IconButton } from '../atoms';
import { ItemInfo, UserInfo } from '../molecules';
import { Item } from '../../types';
import AdminOrReport from '../molecules/AdminOrReport';

export interface ItemCardProps {
  item: Item;
  onOpen: (id: string) => void;
  onMessage: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ItemCard({ item, onOpen, onMessage, onReport, onDelete }: ItemCardProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    // Ignore key events originated from interactive controls inside the card
    const target = e.target as HTMLElement;
    if (target && target.closest && target.closest('button, a, input, textarea, select')) return;

    // Use e.code for consistent detection and prevent default for Space
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      onOpen(item.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // If the click started on an interactive element, don't treat it as a card-open
    const target = e.target as HTMLElement;
    if (target && target.closest && target.closest('button, a, input, textarea, select')) return;
    onOpen(item.id);
  };

  const statusVariant = item.status === 'claimed' ? 'success' : item.status === 'found' ? 'success' : 'warning';
  const statusText = item.status === 'claimed' ? 'Entregado' : item.status === 'found' ? 'Encontrado' : 'Perdido';

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      hoverable
      padding="none"
    >
      <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
            <Badge variant={statusVariant}>{statusText}</Badge>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="mb-4">
            <ItemInfo location={item.location} date={item.date} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <UserInfo name={item.userName} avatar={item.userAvatar} size="sm" />

            <div className="flex items-center space-x-2">
              {/* If current user is admin, show delete (with confirm). Otherwise show report */}
              <AdminOrReport
                id={item.id}
                title={item.title}
                onReport={(id: string) => {
                  /* stopPropagation handled inside AdminOrReport */
                  onReport(id);
                }}
                onDelete={onDelete}
              />
            </div>
        </div>
      </div>
    </Card>
  );
}

