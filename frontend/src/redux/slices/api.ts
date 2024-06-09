import axios from "axios";

export const validateNotExisting = async (field: string, value: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}/auth/validate`,
            {
                [field]: value,
            }
        );
        return { valid: true, message: response.data.message };
    } catch (error: any) {
        return { valid: false, message: error.response.data.error };
    }
};
