export async function getProfile(apiBase: string) {
  const resp = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!resp.ok) throw new Error('Failed to fetch profile');
  return resp.json();
}

export async function updatePhone(apiBase: string, phone: string) {
  // Use the authenticated endpoint that doesn't require sending the userId in the URL
  const resp = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile/update`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ phone_number: phone }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message || `Error ${resp.status}`);
  }

  return resp.json().catch(() => null);
}

export async function logoutRequest(apiBase: string) {
  try {
    await fetch(`${apiBase.replace(/\/$/, '')}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    // ignore
  }
}
