import icon_page from '/icon_page.svg';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeStyles = {
  sm: { icon: 'w-6 h-6', text: 'text-lg' },
  md: { icon: 'w-8 h-8', text: 'text-2xl' },
  lg: { icon: 'w-12 h-12', text: 'text-3xl' },
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <div className="flex items-center space-x-2">
      <div className="w-[50px] h-[50px] overflow-hidden rounded-sm flex items-center justify-center">
        <img src={icon_page} alt="Publicaciones" className="w-full h-full object-contain object-center" />
      </div>
      {showText && (
        <span className={`${styles.text} font-bold text-gray-900 dark:text-white !m-0`}>
          FindIt
        </span>
      )}
    </div>
  );
}
