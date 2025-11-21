import { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import * as userService from '../services/userService';

export function useProfile() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const updateUser = useUserStore((s) => s.updateUser);
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
      const data = await userService.getProfile(apiUrl);
      setUser(data);
    } catch (err) {
      // ignore
    }
  }

  async function savePhone() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await userService.updatePhone(apiUrl, phone);
      updateUser({ phone_number: phone } as any);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await userService.logoutRequest(apiUrl);
    setUser(null);
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
    logout,
  };
}
