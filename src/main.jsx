import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './screens/App'
import './global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
