import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../components/templates';
import { LoginForm } from '../components/organisms';
import ThemeToggle from '../components/atoms/ThemeToggle';
import { useAuth } from '../hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login(email, password);
  };

  return (
    <AuthTemplate onBack={() => navigate('/')}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <LoginForm
        onSubmit={handleLogin}
        onRegister={() => navigate('/register')}
        onForgotPassword={() => alert('Funcionalidad de recuperación de contraseña')}
      />
    </AuthTemplate>
  );
}
