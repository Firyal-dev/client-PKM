const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

/**
 * Mendapatkan domain dasar dari API URL (tanpa /api)
 */
export function getBaseUrl() {
    return API_URL.replace(/\/api$/, '').replace(/\/$/, '');
}

/**
 * Mengubah path media menjadi URL lengkap
 */
export function getMediaUrl(path: string | null | undefined, defaultFolder: string = '') {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const BASE_URL = getBaseUrl();

    let finalPath = path;
    if (!path.startsWith('/') && defaultFolder) {
        const folder = defaultFolder.startsWith('/') ? defaultFolder : `/${defaultFolder}`;
        finalPath = `${folder}/${path}`;
    } else if (!path.startsWith('/')) {
        finalPath = `/${path}`;
    }

    finalPath = finalPath.replace(/\/+/g, '/');

    return `${BASE_URL}${finalPath}`;
}
