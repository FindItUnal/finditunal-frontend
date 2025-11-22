
import useUserStore from '../store/useUserStore';

export default function ProfileInfo() {
  const user = useUserStore((s) => s.user);
  if (!user) return <div className="text-center text-gray-500">No hay usuario</div>;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>

      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-sm font-semibold">
        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
      </div>

      <p className="mt-4 text-gray-700 dark:text-gray-300">Teléfono: {(user as any).phone_number || '—'}</p>
    </div>
  );
}
