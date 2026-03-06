'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/services/api';

export default function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname?.startsWith('/admin')) return;

        const trackVisitor = async () => {
            const hasVisited = sessionStorage.getItem('has_visited_today');
            if (hasVisited) return;

            try {
                const response = await api.post('/v1/visitor/track');
                if (response.status === 200 || response.status === 201) {
                    sessionStorage.setItem('has_visited_today', 'true');
                }
            } catch {
                // Silently fail 
            }
        };  

        trackVisitor();
    }, [pathname]); // <-- Tambahin pathname di dependency array

    return null;
}