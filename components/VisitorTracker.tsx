'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import api from '@/services/api';

export default function VisitorTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tenantSlug, setTenantSlug] = useState<string>('default');

    useEffect(() => {
        // Skip admin routes
        if (pathname?.startsWith('/admin')) return;

        // Get tenant slug from domain or URL
        const getTenantSlug = () => {
            // Option 1: Check URL query parameter (for multi-tenant routing)
            const slugParam = searchParams.get('slug');
            if (slugParam) return slugParam;

            // Option 2: Get from hostname (subdomain-based routing)
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                // Remove port and check for subdomain
                const parts = hostname.split('.');
                if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
                    return parts[0];
                }
            }
            return 'default';
        };

        const slug = getTenantSlug();
        setTenantSlug(slug);
        console.log('Tenant slug:', slug);

        const trackVisitor = async () => {
            const hasVisited = sessionStorage.getItem('has_visited_today');
            if (hasVisited) return;

            try {
                // Include tenant slug in request header for subdomain-based tracking
                const response = await api.post('/v1/visitor/track', null, {
                    headers: {
                        'x-tenant-slug': slug
                    }
                });
                if (response.status === 200 || response.status === 201) {
                    sessionStorage.setItem('has_visited_today', 'true');
                }
            } catch (error: unknown) {
                // Log error for debugging
                console.error('Visitor tracking error:', error);
            }
        };

        trackVisitor();
    }, [pathname, searchParams]);

    return null;
}