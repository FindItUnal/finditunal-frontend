import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import useGlobalStore from '../../store/useGlobalStore';
import ConfirmDialog from '../molecules/ConfirmDialog';
import { Button, Input } from '../atoms';

export interface ProfileEditorProps {
  className?: string;
}

export default function ProfileEditor({ className = '' }: ProfileEditorProps) {
  const { isEditing, setIsEditing, phone, setPhone, savePhone, saving, error } = useProfile();
  const logoutFromStore = useUserStore((s) => s.logout);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    await logoutFromStore(apiUrl, navigate);
  };

  if (!isEditing) {
    return (
      <div className={className}>
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsEditing(true)}
          >
            Editar perfil
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={() => setConfirmOpen(true)}
          >
            Cerrar sesión
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Cerrar sesión"
            description="¿Deseas cerrar sesión?"
            confirmLabel="Cerrar sesión"
            cancelLabel="Cancelar"
            onConfirm={handleLogout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Editar información</h4>

      <div className="space-y-4">
        <Input
          label="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={error || undefined}
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => savePhone()}
            disabled={saving}
            isLoading={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}

