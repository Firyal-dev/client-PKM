// lib/getSubdomainUrl.ts
export function getSubdomainUrl(slug: string) {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        return `http://${slug}.localhost:3000`
    }

    return `https://${slug}.kotabogor.go.id`
}