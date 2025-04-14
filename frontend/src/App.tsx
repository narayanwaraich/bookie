import { QueryClientProvider } from '@tanstack/react-query';
import './App.css'
import { queryClient } from './lib/queryClient';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app here */}
    </QueryClientProvider>
  );
}

export default App;