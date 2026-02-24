'use client';

import { useEffect } from 'react';
import api from '@/services/api';

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisitor = async () => {
            const hasVisited = sessionStorage.getItem('has_visited_today');

            if (hasVisited) return;

            try {
                const response = await api.post('/v1/visitor/track');
                if (response.status === 200 || response.status === 201) {
                    sessionStorage.setItem('has_visited_today', 'true');
                }
            } catch {
                // Silently fail - visitor tracking is non-critical
            }

        };

        trackVisitor();
    }, []);

    return null;
}