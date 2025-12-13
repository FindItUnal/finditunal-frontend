import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationToastProvider } from './context/NotificationToastContext';
import { BrowserRouter } from 'react-router-dom';
import AppInitializer from './components/AppInitializer';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationToastProvider>
          <BrowserRouter>
            <AppInitializer />
          </BrowserRouter>
        </NotificationToastProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
