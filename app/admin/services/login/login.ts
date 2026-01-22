import api from "@/app/admin/services/api";
import { User } from "@/app/types/userInterface";

export const register = async (user: User) => {
    try {
        const response = await api.post("/auth/login", user);
        return response.data;
    } catch (error) {
        throw error;
    }
}