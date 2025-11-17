import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import { SearchFilterBar, ItemGrid, EmptyState } from '../components/organisms';
import PublishModal from '../components/organisms/PublishModal';
import { useApp } from '../context/AppContext';
import { useSearchFilter, useModal } from '../hooks';
import { Item } from '../types';
import ReportDialog from '../components/molecules/ReportDialog';

// Mock data
const mockItems: Item[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    description: 'Encontrado en la biblioteca, con funda azul',
    category: 'Electrónicos',
    imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Biblioteca Central',
    date: '2025-10-20',
    status: 'found',
    userId: '2',
    userName: 'María García',
    createdAt: '2025-10-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Mochila negra Nike',
    description: 'Mochila deportiva con libros de ingeniería',
    category: 'Mochilas',
    imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Gimnasio Universitario',
    date: '2025-10-19',
    status: 'found',
    userId: '3',
    userName: 'Carlos Ruiz',
    createdAt: '2025-10-19T14:30:00Z',
  },
  {
    id: '3',
    title: 'Laptop Dell',
    description: 'Laptop con stickers de programación',
    category: 'Electrónicos',
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    location: 'Aula 305',
    date: '2025-10-18',
    status: 'found',
    userId: '4',
    userName: 'Ana López',
    createdAt: '2025-10-18T16:45:00Z',
  },
  {
    id: '4',
    title: 'Llaves con llavero rojo',
    description: 'Juego de llaves con llavero de Marvel',
    category: 'Llaves',
    imageUrl: 'https://images.pexels.com/photos/277572/pexels-photo-277572.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Cafetería',
    date: '2025-10-21',
    status: 'found',
    userId: '5',
    userName: 'Pedro Martínez',
    createdAt: '2025-10-21T09:15:00Z',
  },
  {
    id: '5',
    title: 'Audífonos Bluetooth',
    description: 'Audífonos Sony negros con estuche',
    category: 'Electrónicos',
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Laboratorio de Cómputo',
    date: '2025-10-17',
    status: 'found',
    userId: '6',
    userName: 'Laura Fernández',
    createdAt: '2025-10-17T11:20:00Z',
  },
  {
    id: '6',
    title: 'Libro Cálculo II',
    description: 'Libro con nombre en la primera página',
    category: 'Libros',
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Salón 201',
    date: '2025-10-22',
    status: 'found',
    userId: '7',
    userName: 'Roberto Díaz',
    createdAt: '2025-10-22T13:00:00Z',
  },
];

const categories = ['Todas', 'Electrónicos', 'Mochilas', 'Llaves', 'Libros', 'Ropa', 'Documentos', 'Otros'];

export default function DashboardPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, filterItems } = useSearchFilter('Todas');
  const publishModal = useModal();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportItemId, setReportItemId] = useState<string | null>(null);

  const filteredItems = filterItems(mockItems);

  const handlePublish = (data: any) => {
    console.log('Publishing item:', data);
    alert(`Objeto publicado: ${data.title}`);
  };

  return (
    <PageTemplate
      title={`Bienvenido, ${user?.name}`}
      subtitle="Encuentra objetos perdidos o publica algo que hayas encontrado"
    >
      <div className="space-y-8">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPublish={publishModal.open}
        />

        {filteredItems.length > 0 ? (
          <ItemGrid
            items={filteredItems}
            onItemOpen={(id) => {
              navigate(`/object/${id}`);
              console.log(`Abrir objeto ${id}`);
            }}
            onItemMessage={() => navigate('/messages')}
            onItemReport={(id) => {
              setReportItemId(id);
              setReportOpen(true);
            }}
            onItemDelete={(id) => {
              // For now just alert; in a real app you'd call backend to delete and refresh list

              console.log(`Eliminar publicación ${id}`);
            }}
          />
        ) : (
          <EmptyState
            title="No se encontraron resultados"
            description="Intenta con otros términos de búsqueda o filtros"
          />
        )}
      </div>

      <PublishModal
        open={publishModal.isOpen}
        onOpenChange={(open) => {
          if (!open) publishModal.close();
        }}
        onPublish={handlePublish}
        categories={categories.filter((c) => c !== 'Todas')}
      />

      <ReportDialog
        open={reportOpen}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) setReportItemId(null);
        }}
        onReport={(payload) => {
          alert(`Reporte enviado para item ${reportItemId}: ${JSON.stringify(payload)}`);
          setReportOpen(false);
          setReportItemId(null);
        }}
      />
    </PageTemplate>
  );
}
