import { useEffect, useState } from 'react';

// Qiymat o'zgarishini `delay` ms kechiktiradi (qidiruv inputi uchun).
export default function useDebouncedValue(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
