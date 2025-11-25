import { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService } from '../services';

export function useProfile() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const refreshUserFromStore = useUserStore((s) => s.refreshUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState((user as any)?.phone_number ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPhone((user as any)?.phone_number ?? '');
  }, [user]);

  async function refreshProfile() {
    try {
      await refreshUserFromStore(apiUrl);
    } catch (err) {
      // ignore
    }
  }

  async function savePhone() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await profileService.updatePhone(apiUrl, phone);
      updateUser({ phone_number: phone } as any);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || 'Error saving');
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
