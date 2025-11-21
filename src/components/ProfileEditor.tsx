import React from 'react';
import { useProfile } from '../hooks/useProfile';

export default function ProfileEditor() {
  const { isEditing, setIsEditing, phone, setPhone, savePhone, saving, error } = useProfile();

  if (!isEditing) {
    return (
      <div>
        <button
          className="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
          onClick={() => setIsEditing(true)}
        >
          Editar perfil
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Editar información</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg bg-transparent"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
            onClick={() => savePhone()}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
