import { IconButton } from '../atoms';
import { Flag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useApp } from '../../context/AppContext';

interface AdminOrReportProps {
  id: string;
  title?: string;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AdminOrReport({ id, title, onReport, onDelete }: AdminOrReportProps) {
  const { user } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (user?.role === 'admin') {
    return (
      <>
        <IconButton
          icon={Trash2}
          variant="danger"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          ariaLabel={`Eliminar ${title ?? id}`}
        />
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => setConfirmOpen(open)}
          title="Eliminar publicación"
          description="¿Deseas eliminar esta publicación? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={() => {
            if (onDelete) onDelete(id);
            setConfirmOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <IconButton
      icon={Flag}
      variant="danger"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onReport(id);
      }}
      ariaLabel={`Denunciar ${title ?? id}`}
    />
  );
}
