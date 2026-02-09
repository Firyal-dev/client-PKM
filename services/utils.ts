import { isAxiosError } from "axios";

/**
 * Interface standar untuk respon aksi (mutasi)
 */
export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Menangani error dari API/Axios secara konsisten
 */
export const handleServiceError = (error: unknown, fallbackMessage: string): string => {
    if (isAxiosError(error)) {
        return error.response?.data?.message || error.message || fallbackMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallbackMessage;
};

/**
 * Wrapper untuk fungsi async yang mengembalikan ActionResponse
 */
export async function tryAction<T>(
    action: () => Promise<T>,
    fallbackMessage: string
): Promise<ActionResponse<T>> {
    try {
        const result = await action();
        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error: handleServiceError(error, fallbackMessage),
        };
    }
}
