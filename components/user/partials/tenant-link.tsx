'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

export function TenantLink({ href, ...props }: React.ComponentProps<typeof Link>) {
    const params = useParams()
    const tenantSlug = params?.tenantSlug as string

    if (!tenantSlug) {
        return <Link href={href} {...props} />
    }

    if (typeof href === 'string') {
        if (href.startsWith('http') || href.startsWith('/admin') || href.startsWith('/puskesmas')) {
            return <Link href={href} {...props} />
        }
        
        // Remove duplicate slash if href is strictly "/"
        const targetHref = href === '/' ? `/${tenantSlug}` : href.startsWith('/') ? `/${tenantSlug}${href}` : href
        return <Link href={targetHref} {...props} />
    }

    return <Link href={href} {...props} />
}
