import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
        : "flex flex-col items-center justify-center p-8 w-full h-full";

    return (
        <div className={containerClasses}>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-zinc-400 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
