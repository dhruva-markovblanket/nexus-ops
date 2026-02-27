import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-zinc-400 mb-6 text-sm">
                            We've encountered an unexpected error while rendering this page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
