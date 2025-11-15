import * as Dialog from '@radix-ui/react-dialog';
import { useState, FormEvent, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish?: (payload: any) => void;
  categories?: string[];
  locations?: string[];
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
  };
  /** Label for the submit button (default: Publicar) */
  submitLabel?: string;
}

const defaultCategories = [
  'Electrónicos',
  'Documentos',
  'Ropa y accesorios',
  'Libros y útiles',
  'Llaves',
  'Carteras y bolsos',
  'Otros',
];

const defaultLocations = [
  'Edificio 401',
  'Edificio 405',
  'Biblioteca Central',
  'Cafetería',
  'Auditorio',
  'Plaza central',
  'Parqueadero',
  'Otro',
];

export default function PublishModal({ 
  open, 
  onOpenChange, 
  onPublish, 
  categories = defaultCategories, 
  locations = defaultLocations, 
  initialData, 
  submitLabel = 'Publicar' 
}: PublishModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? (categories[0] || ''),
    location: initialData?.location ?? (locations[0] || ''),
    type: (initialData?.type as 'found' | 'lost') ?? 'found',
    found_date: initialData?.found_date ?? new Date().toISOString().split('T')[0],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl ?? null);

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        category: initialData?.category ?? (categories[0] || ''),
        location: initialData?.location ?? (locations[0] || ''),
        type: (initialData?.type as 'found' | 'lost') ?? 'found',
        found_date: initialData?.found_date ?? new Date().toISOString().split('T')[0],
      });
      setImagePreview(initialData?.imageUrl ?? null);
    }
  }, [open, initialData, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, image_preview: imagePreview };
    if (onPublish) onPublish(payload);
    onOpenChange(false);
  };

  const modalTitle = submitLabel.toLowerCase().includes('editar') ? 'Editar objeto' : 'Publicar objeto';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
  <style>{`.publish-modal-scroll::-webkit-scrollbar{width:10px;height:10px}.publish-modal-scroll::-webkit-scrollbar-track{background:transparent}.publish-modal-scroll::-webkit-scrollbar-thumb{background-color:#0d9488;border-radius:9999px;border:3px solid transparent;background-clip:padding-box}.publish-modal-scroll::-webkit-scrollbar-corner{background:transparent}.publish-modal-scroll::-webkit-scrollbar-button{display:none}.publish-modal-scroll{scrollbar-width:thin;scrollbar-color:#0d9488 transparent}.publish-modal-scroll input[type=number]::-webkit-outer-spin-button,.publish-modal-scroll input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.publish-modal-scroll input[type=number]{-moz-appearance:textfield}`}</style>
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 publish-modal-scroll">
            {/* Type Selection */}
            <div className="flex gap-3">
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={() => setFormData({ ...formData, type: 'found' })}
                  className="sr-only peer"
                />
                <div className="cursor-pointer p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:border-teal-600 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20 transition-all">
                  <p className="font-semibold text-center text-gray-900 dark:text-white text-sm">
                    Objeto encontrado
                  </p>
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={() => setFormData({ ...formData, type: 'lost' })}
                  className="sr-only peer"
                />
                <div className="cursor-pointer p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:border-orange-600 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20 transition-all">
                  <p className="font-semibold text-center text-gray-900 dark:text-white text-sm">
                    Objeto perdido
                  </p>
                </div>
              </label>
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
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el objeto con el mayor detalle posible..."
                required
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  {categories.map((cat) => (
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
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
                className="flex-1 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all text-sm"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
