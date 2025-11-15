import { MapPin, Calendar } from 'lucide-react';

export interface ItemInfoProps {
  location: string;
  date: string;
}

export default function ItemInfo({ location, date }: ItemInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <MapPin className="w-4 h-4 mr-2" />
        {location}
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Calendar className="w-4 h-4 mr-2" />
        {new Date(date).toLocaleDateString('es-ES')}
      </div>
    </div>
  );
}
