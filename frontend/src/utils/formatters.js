// Format a date string (e.g., from Prisma DateTime)
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

// Format time from 24h to 12h AM/PM
export const formatTime = (time24) => {
    if (!time24) return 'N/A';
    const [h, m] = time24.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10));
    d.setMinutes(parseInt(m, 10));
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(d);
};

// Color code grades
export const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
        case 'A': return 'text-emerald-400';
        case 'B': return 'text-blue-400';
        case 'C': return 'text-yellow-400';
        case 'D': return 'text-orange-400';
        case 'F': return 'text-red-400';
        default: return 'text-zinc-400';
    }
};

// Relative time format (e.g., "2 days ago")
export const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString);
};
