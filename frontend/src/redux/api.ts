import api_root from "@/config";
import axios from "axios";

const validateNotExisting = async (field: string, value: string) => {
  try {
    const response = await axios.post(`${api_root}/account/validate`, { [field]: value });
    return { valid: true, message: response.data.message };
  } catch (error: any) {
    return { valid: false, message: error.response.data.error };
  }
};

export default validateNotExisting;
