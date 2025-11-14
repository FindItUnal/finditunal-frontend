export interface RadioGroupProps {
  name: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
  colorScheme?: 'teal' | 'orange' | 'blue';
}

const colorStyles = {
  teal: 'peer-checked:border-teal-600 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20',
  orange: 'peer-checked:border-orange-600 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20',
  blue: 'peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20',
};

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  colorScheme = 'teal',
}: RadioGroupProps) {
  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <label key={option.value} className="flex-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only peer"
          />
          <div
            className={`cursor-pointer p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-all ${colorStyles[colorScheme]}`}
          >
            <p className="font-semibold text-center text-gray-900 dark:text-white text-sm">
              {option.label}
            </p>
            {option.description && (
              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
