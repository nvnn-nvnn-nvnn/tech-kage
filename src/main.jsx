import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { BuilderProvider } from './context/BuilderContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <BuilderProvider>
            <App />
          </BuilderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
