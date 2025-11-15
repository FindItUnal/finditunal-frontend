import { Card, Button } from '../atoms';
import { SearchBar, CategoryFilter } from '../molecules';
import { Filter } from 'lucide-react';
import { useState } from 'react';

export interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPublish?: () => void;
}

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onPublish,
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card padding="md">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, descripción, ubicación..."
          />
        </div>
        <Button
          variant="secondary"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </Button>
        {onPublish && (
          <Button variant="primary" onClick={onPublish}>
            Publicar Objeto
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Categorías
          </h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      )}
    </Card>
  );
}
