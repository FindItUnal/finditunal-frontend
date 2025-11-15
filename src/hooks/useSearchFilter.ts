import { useState, useCallback } from 'react';

export interface UseSearchFilterReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filterItems: <T extends { title: string; description: string; category: string }>(
    items: T[]
  ) => T[];
}

export function useSearchFilter(
  initialCategory: string = 'Todas'
): UseSearchFilterReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filterItems = useCallback(
    <T extends { title: string; description: string; category: string }>(items: T[]): T[] => {
      return items.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'Todas' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
    [searchTerm, selectedCategory]
  );

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filterItems,
  };
}
