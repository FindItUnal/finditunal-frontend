import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95%,520px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 z-50">
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-6">{description}</Dialog.Description>

          <div className="flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{cancelLabel}</button>
            </Dialog.Close>
            <button
              onClick={async () => {
                if (onConfirm) await onConfirm();
                onOpenChange(false);
              }}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
