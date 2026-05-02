import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/wagmiConfig';
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient();

console.log("Aplikasi PredictL2 sedang dimulai...");
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = "<h1>React is starting...</h1>";
}

createRoot(rootElement).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
