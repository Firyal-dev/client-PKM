const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

/**
 * Mendapatkan domain dasar dari API URL (tanpa /api atau /v1)
 */
export function getBaseUrl() {
    // Menghapus /api, /api/v1, /v1 di akhir URL
    return API_URL
        .replace(/\/api\/v1\/?$/, '')
        .replace(/\/api\/?$/, '')
        .replace(/\/v1\/?$/, '')
        .replace(/\/$/, '');
}

/**
 * Mengubah path media menjadi URL lengkap
 */
export function getMediaUrl(path: string | null | undefined, defaultFolder: string = '') {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    // Handle special default images that are in client/public
    const clientPublicImages = ['puskesmasLogo.png', 'userPlaceholder.jpg', 'authBg.jpg', 'breadcrumb_bg.jpeg'];
    if (clientPublicImages.includes(path)) {
        return `/${path}`;
    }

    const BASE_URL = getBaseUrl();
    let finalPath = path;

    // Jika path tidak diawali / dan ada defaultFolder, gabungkan
    if (!path.startsWith('/') && defaultFolder) {
        const folder = defaultFolder.startsWith('/') ? defaultFolder : `/${defaultFolder}`;
        finalPath = `${folder}/${path}`;
    } else if (!path.startsWith('/')) {
        finalPath = `/${path}`;
    }

    // Bersihkan multiple slashes
    finalPath = finalPath.replace(/\/+/g, '/');

    // Gabungkan BASE_URL dan finalPath, pastikan join-nya benar
    const baseUrlClean = BASE_URL.replace(/\/$/, '');
    const pathClean = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;

    return `${baseUrlClean}${pathClean}`;
}
