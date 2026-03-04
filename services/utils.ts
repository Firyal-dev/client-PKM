import { redirect } from 'next/navigation'

import { clearAuthToken } from '@/services/auth-token'

// Response paginated
export interface PaginatedResponse<T> { data: T[]; totalPages: number; currentPage: number; totalDocs?: number }

// Response action
export interface ActionResponse<T = unknown> { success: boolean; data?: T; error?: string; message?: string }

// Handle error
export const handleServiceError = (err: any, fallback: string): string => {
    if (err?.isAxiosError && err.response?.status === 401) {
        throw new Error('UNAUTHORIZED_401');
    }
    
    if (err?.isAxiosError) return err.response?.data?.message || err.message || fallback
    if (err instanceof Error) return err.message
    return fallback
}

// Parse response paginated
export const parsePaginatedResponse = <T>(res: { data: { docs?: T[]; data?: T[] } & Record<string, unknown> }, defPage = 1): PaginatedResponse<T> => ({
    data: res.data.docs || res.data.data || [],
    totalPages: (res.data.totalPages as number) || 1,
    currentPage: (res.data.page as number) || defPage,
    totalDocs: res.data.totalDocs as number | undefined
})

// Wrapper action - return ActionResponse
export async function tryAction<T>(action: () => Promise<T>, fallback: string): Promise<ActionResponse<T>> {
    try {
        const result = await action()
        return { success: true, data: result }
    } catch (err) {
        return { success: false, error: handleServiceError(err, fallback) }
    }
}

// Wrapper action - redirect jika unauthorized
export async function tryActionWithAuth<T>(action: () => Promise<T>, fallback: string, redirectPath = '/admin/login'): Promise<ActionResponse<T>> {
    try {
        const result = await action()
        return { success: true, data: result }
    } catch (err) {
        if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'UNAUTHORIZED_401')) {
            await clearAuthToken();
            redirect(redirectPath);
        }
        return { success: false, error: handleServiceError(err, fallback) }
    }
}

// Revalidation time (1 jam)
export const SSG_REVALIDATE_TIME = 3600

// Cache tags
export const CACHE_TAGS = {
    AGENDA: 'agenda',
    ALBUM: 'album',
    BANNER: 'banners',
    GALLERY: 'gallery',
    REVIEW: 'reviews',
    PROFILE: 'profile',
    NEWS: 'news',
    MENU: 'menu',
    PAGE: 'page',
    STATIC_PAGE: 'static_pages',
    VIDEO: 'videos',
    SERVICES: 'services',
    CONSULTATION: 'consultation',
    WEB_INFO: 'web_info',
} as const
