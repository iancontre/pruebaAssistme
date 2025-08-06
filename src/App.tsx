import AppRoutes from './router/Routes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
