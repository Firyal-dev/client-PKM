// lib/getSubdomainUrl.ts
export function getSubdomainUrl(slug: string) {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        return `http://localhost:3000/${slug}`
    }

    // Ganti base domain sesuai dengan domain utama production
    return `https://dinkes.kotabogor.go.id/${slug}`
}