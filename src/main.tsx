import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Toaster } from 'sonner';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';

createRoot(document.getElementById("root")!).render(
    <>
        <Toaster
            position="top-center"
            expand={false}
            richColors
            theme="system"
            duration={3000}
            className="bg-background text-foreground"
            toastOptions={{
                className: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                descriptionClassName: "group-[.toast]:text-muted-foreground",
            }}
        />
        <AuthProvider>
            <App />
        </AuthProvider>
    </>
);
