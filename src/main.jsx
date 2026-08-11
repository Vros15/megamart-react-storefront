import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { CartProvider } from './context/CartContext'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Ensure the Clerk publishable key is defined before rendering the app.
if (!publishableKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is missing')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={publishableKey}>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </ClerkProvider>,
)
