import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

console.log('React main.tsx is running');

createRoot(document.getElementById('root')!).render(<App />);
