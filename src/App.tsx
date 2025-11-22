import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import AppInitializer from './components/AppInitializer';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppInitializer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
