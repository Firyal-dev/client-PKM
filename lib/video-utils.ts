/**
 * Utility functions for video handling
 */

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * and returns a standard embed URL.
 */
export function getYouTubeEmbedUrl(url: string) {
    if (!url) return ""
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    const videoId = (match && match[2].length === 11) ? match[2] : null

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
    }
    return url
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * and returns a standard thumbnail URL (maxresdefault).
 */
export function getYouTubeThumbnail(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    const videoId = (match && match[2].length === 11) ? match[2] : null

    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    return null
}
