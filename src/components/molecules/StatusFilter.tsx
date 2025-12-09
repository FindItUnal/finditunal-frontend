export interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const statuses = ['Todos', 'Perdido', 'Encontrado'];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedStatus === status
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

