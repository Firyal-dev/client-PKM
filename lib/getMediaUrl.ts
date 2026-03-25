const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

/**
 * Mendapatkan domain dasar dari API URL (tanpa /api atau /v1)
 */
export function getBaseUrl() {
    let url = API_URL.replace(/\/$/, '');

    // Pastikan base URL sudah pakai versi API (v1) tempat controller Files terdaftar
    if (!url.endsWith('/v1')) {
        url += '/v1';
    }

    return url;
}

/**
 * Mengubah path media menjadi URL lengkap
 * 
 * BARU: Format path sekarang adalah /{slug}/{module}/{filename}
 * (file disimpan di public/{slug}/{module}/ dan diakses langsung via static file serving)
 * 
 * Masih support backward compatibility untuk path lama /files/{tenant}/{module}/{filename}
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

    // Clean base URL - hapus /v1 karena sekarang static files dilayani langsung
    // Dari http://localhost:3002/api/v1 -> http://localhost:3002/api
    let baseUrlClean = BASE_URL.replace(/\/v1$/, '').replace(/\/$/, '');

    // Jika path adalah format baru /{slug}/{module}/{filename}, langsung gabungkan
    // Jika path adalah format lama /files/{tenant}/{module}/{filename}, convert ke baru
    let finalPath = path;

    if (path.startsWith('/files/')) {
        // Convert dari /files/{tenant}/{module}/{filename} ke /{tenant}/{module}/{filename}
        finalPath = path.replace('/files/', '/');
    } else if (!path.startsWith('/')) {
        finalPath = `/${path}`;
    }

    // Jika path tidak dimulai dengan / dan ada defaultFolder, gabungkan
    if (!path.startsWith('/') && defaultFolder) {
        const folder = defaultFolder.startsWith('/') ? defaultFolder : `/${defaultFolder}`;
        finalPath = `${folder}/${path}`;
    }

    // Bersihkan multiple slashes
    finalPath = finalPath.replace(/\/+/g, '/');

    // Gabungkan baseUrlClean dan finalPath
    const pathClean = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;

    return `${baseUrlClean}${pathClean}`;
}
