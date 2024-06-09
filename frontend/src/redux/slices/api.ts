import axios from "axios";

export const validateNotExisting = async (field: string, value: string) => {
    try {
        const response = await axios.post(`${api_root}/auth/validate`, {
            [field]: value,
        });
        return { valid: true, message: response.data.message };
    } catch (error: any) {
        return { valid: false, message: error.response.data.error };
    }
};

export const login = async (username: string, password: string) => {
    try {
        const response = await axios
            .post(`${api_root}/login`, { username, password })
            .catch((error) => {
                return { error: error.response.data };
            });
    } catch (error: any) {
        return { error: error.response.data };
    }
};
