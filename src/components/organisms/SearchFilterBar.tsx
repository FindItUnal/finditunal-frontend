import { Card, Button } from '../atoms';
import { SearchBar, CategoryFilter, StatusFilter, LocationFilter } from '../molecules';
import { Filter } from 'lucide-react';
import { useState } from 'react';

export interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  locations?: string[];
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  onPublish?: () => void;
}

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  locations,
  selectedLocation,
  onLocationChange,
  onPublish,
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card padding="md">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onSearch={onSearchChange}
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
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
          {/* Estado y Ubicación en grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Estado
              </h3>
              {selectedStatus !== undefined && onStatusChange && (
                <StatusFilter
                  selectedStatus={selectedStatus}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Ubicación
              </h3>
              {locations && selectedLocation !== undefined && onLocationChange && (
                <LocationFilter
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationChange={onLocationChange}
                />
              )}
            </div>
          </div>
          {/* Categorías en fila completa */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Categorías
            </h3>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
