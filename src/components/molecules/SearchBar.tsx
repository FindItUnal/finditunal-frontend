import { Input } from '../atoms';
import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export default function SearchBar({ onSearch, onChange, value, ...props }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onSearch?.(e.target.value);
  };

  return (
    <Input
      type="text"
      icon={Search}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}
