
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set default sidebar state as collapsed in cookie
document.cookie = "sidebar:state=false; path=/; max-age=604800";

createRoot(document.getElementById("root")!).render(<App />);
