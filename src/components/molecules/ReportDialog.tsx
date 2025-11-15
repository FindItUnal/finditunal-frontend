import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X } from 'lucide-react';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReport?: (payload: { reasons: string[]; details?: string }) => void;
}

const REASONS = [
  'Fraude / estafa',
  'Contenido inapropiado',
  'Información personal expuesta',
  'Objeto no relacionado / spam',
  'Otro',
];

export default function ReportDialog({ open, onOpenChange, onReport }: ReportDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState('');

  const toggleReason = (r: string) => {
    setSelected((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { reasons: selected, details: details.trim() || undefined };
    if (onReport) onReport(payload);
    onOpenChange(false);
    setSelected([]);
    setDetails('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
  <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
  <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95%,560px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 z-50">
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Denunciar publicacion</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300">Selecciona el/los motivos por los que denuncias esta publicacion:</Dialog.Description>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(r)}
                    onChange={() => toggleReason(r)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{r}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Detalles (opcional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Opcional: explica por qué consideras que debe ser reportado"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Cancelar</button>
              </Dialog.Close>
              <button type="submit" className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white">Enviar denuncia</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
