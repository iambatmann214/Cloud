import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Set initial theme
const savedTheme = (() => {
  try {
    const stored = localStorage.getItem('aws-academy-progress');
    if (stored) {
      const data = JSON.parse(stored);
      return data.theme || 'light';
    }
  } catch {
    // ignore
  }
  return 'light';
})();

document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
