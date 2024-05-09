import api_root from "@/config";
import axios from "axios";

const validateNotExisting = async (field: string, value: string) => {
  const result = await axios.post(`http://${api_root}/account/validate`, { [field]: value });
};
