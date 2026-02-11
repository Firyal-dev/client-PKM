import { isAxiosError } from 'axios'
import { redirect } from 'next/navigation'

/**
 * Generic interface for paginated response
 */
export interface PaginatedResponse<T> {
    data: T[]
    totalPages: number
    currentPage: number
    totalDocs?: number
}

/**
 * Interface for action/mutation response
 */
export interface ActionResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

/**
 * Handle error from API/Axios consistently
 */
export const handleServiceError = (error: unknown, fallbackMessage: string): string => {
    if (isAxiosError(error)) {
        return error.response?.data?.message || error.message || fallbackMessage
    }
    if (error instanceof Error) {
        return error.message
    }
    return fallbackMessage
}

/**
 * Parse pagination from API response
 */
export const parsePaginatedResponse = <T>(
    response: { data: { docs?: T[]; data?: T[] } & Record<string, unknown> },
    defaultPage = 1
): PaginatedResponse<T> => {
    const docs = response.data.docs || response.data.data || []
    return {
        data: docs,
        totalPages: (response.data.totalPages as number) || 1,
        currentPage: (response.data.page as number) || defaultPage,
        totalDocs: response.data.totalDocs as number | undefined
    }
}

/**
 * Wrapper for async action returning ActionResponse
 */
export async function tryAction<T>(
    action: () => Promise<T>,
    fallbackMessage: string
): Promise<ActionResponse<T>> {
    try {
        const result = await action()
        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            error: handleServiceError(error, fallbackMessage)
        }
    }
}

/**
 * Wrapper for async action with redirect on unauthorized
 */
export async function tryActionWithAuth<T>(
    action: () => Promise<T>,
    fallbackMessage: string,
    redirectPath = '/admin/login'
): Promise<ActionResponse<T>> {
    try {
        const result = await action()
        return {
            success: true,
            data: result
        }
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            redirect(redirectPath)
        }
        return {
            success: false,
            error: handleServiceError(error, fallbackMessage)
        }
    }
}

/**
 * Default revalidation time for SSG (1 hour)
 */
export const SSG_REVALIDATE_TIME = 3600

/**
 * Cache tag separator
 */
export const CACHE_TAGS = {
    AGENDA: 'agenda',
    ALBUM: 'album',
    BANNER: 'banners',
    GALLERY: 'gallery',
    REVIEW: 'reviews',
    PROFILE: 'profile'
} as const
