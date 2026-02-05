import { useMemo } from "react";

export const useBaseUrl = () => {
    const baseUrl = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_API_URL || "";
        return url.replace(/\/api$/, "");
    }, []);

    return baseUrl;
}