import { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService } from '../services';
import { User } from '../types';

export interface UseProfileReturn {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  phone: string;
  setPhone: (phone: string) => void;
  saving: boolean;
  error: string | null;
  savePhone: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const refreshUserFromStore = useUserStore((s) => s.refreshUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPhone(user?.phone_number ?? '');
  }, [user]);

  async function refreshProfile() {
    try {
      await refreshUserFromStore(apiUrl);
    } catch {
      // ignore
    }
  }

  async function savePhone() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await profileService.updateProfile(apiUrl, { phone_number: phone });
      updateUser({ phone_number: phone });
      setIsEditing(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return {
    user,
    isEditing,
    setIsEditing,
    name,
    setName,
    email,
    phone,
    setPhone,
    saving,
    error,
    savePhone,
    refreshProfile,
  };
}
