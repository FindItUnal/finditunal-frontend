import * as Dialog from '@radix-ui/react-dialog';
import { useState, FormEvent, useEffect, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import { Category } from '../../services/categoryService';
import { Location } from '../../services/locationService';

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish?: (payload: {
    title: string;
    description: string;
    category: string;
    location: string;
    type: 'found' | 'lost';
    found_date: string;
    contact_method: string;
    image?: File;
    reportId?: string; // Para modo edición
  }) => void;
  categories?: Category[];
  locations?: Location[];
  /** If provided, the modal will initialize the form with these values (edit mode) */
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    location?: string;
    type?: 'found' | 'lost';
    found_date?: string;
    imageUrl?: string;
    contact_method?: string;
  };
  /** Label for the submit button (default: Publicar) */
  submitLabel?: string;
  isLoading?: boolean;
}

export default function PublishModal({ 
  open, 
  onOpenChange, 
  onPublish, 
  categories = [], 
  locations = [], 
  initialData, 
  submitLabel = 'Publicar',
  isLoading = false
}: PublishModalProps) {
  // Extraer nombres de categorías y ubicaciones para mostrar (memoizado para evitar re-renders)
  const categoryNames = useMemo(() => categories.map(cat => cat.name), [categories]);
  const locationNames = useMemo(() => locations.map(loc => loc.name), [locations]);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? '',
    location: initialData?.location ?? '',
    type: (initialData?.type as 'found' | 'lost') ?? 'lost',
    found_date: initialData?.found_date ?? new Date().toISOString().split('T')[0],
    contact_method: initialData?.contact_method ?? '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Reset form SOLO cuando se abre el modal (no cuando cambian las categorías/ubicaciones)
  useEffect(() => {
    if (open) {
      setFormData({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        category: initialData?.category ?? '', // Vacío para mostrar placeholder
        location: initialData?.location ?? '', // Vacío para mostrar placeholder
        type: (initialData?.type as 'found' | 'lost') ?? 'lost',
        found_date: initialData?.found_date ?? new Date().toISOString().split('T')[0],
        contact_method: initialData?.contact_method ?? '',
      });
      setImagePreview(initialData?.imageUrl ?? null);
      setImageFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData?.id]); // Solo resetear cuando cambie open o el id del item a editar

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      image: imageFile || undefined,
      reportId: initialData?.id,
    };
    if (onPublish) onPublish(payload);
  };

  const modalTitle = submitLabel.toLowerCase().includes('editar') ? 'Editar objeto' : 'Publicar objeto';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95%,600px)] max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              {modalTitle}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 modal-scroll">
            {/* Type Selection */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'found' })}
                className={`flex-1 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                  formData.type === 'found'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <p className="font-semibold text-center text-gray-900 dark:text-white text-sm">
                  Objeto encontrado
                </p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'lost' })}
                className={`flex-1 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                  formData.type === 'lost'
                    ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <p className="font-semibold text-center text-gray-900 dark:text-white text-sm">
                  Objeto perdido
                </p>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ejemplo: iPhone 13 Pro"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el objeto con el mayor detalle posible..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none text-sm"
              />
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {categoryNames.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  <option value="" disabled>Selecciona una ubicación</option>
                  {locationNames.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Método de contacto
              </label>
              <input
                type="text"
                value={formData.contact_method}
                onChange={(e) => setFormData({ ...formData, contact_method: e.target.value })}
                placeholder="Ejemplo: email@ejemplo.com o 3001234567"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={formData.found_date}
                onChange={(e) => setFormData({ ...formData, found_date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fotografía (opcional)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Haz clic para subir una imagen</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Dialog.Close asChild>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all text-sm"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold transition-all text-sm"
              >
                {isLoading ? 'Guardando...' : submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
