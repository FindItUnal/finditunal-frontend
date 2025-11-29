import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { BrowserRouter } from 'react-router-dom';
import AppInitializer from './components/AppInitializer';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppInitializer />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
