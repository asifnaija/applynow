import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // While prohibited to create separate css files, this is usually needed for tailwind directives if not using CDN. Since we use CDN, we can ignore or keep empty.

// Clear old local storage keys to remove mock data
localStorage.removeItem('applynow_apps_v2');
localStorage.removeItem('applynow_apps');

// Inject custom styles that Tailwind utilities can't cover easily (like stepper animations)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .btn-primary {
    @apply px-4 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2;
    border-radius: 12px; /* Squircle shape */
  }
  .btn-secondary {
    @apply px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2;
    border-radius: 12px; /* Squircle shape */
  }
`;
document.head.appendChild(style);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);