import AppRoutes from './router/Routes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
    <div className="App">
      <AppRoutes />
    </div>
    </ErrorBoundary>
  );
}

export default App;
