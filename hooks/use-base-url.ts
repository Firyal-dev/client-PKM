import { useMemo } from "react";
import { getBaseUrl } from "@/lib/getMediaUrl";

export const useBaseUrl = () => {
    const baseUrl = useMemo(() => getBaseUrl(), []);
    return baseUrl;
}