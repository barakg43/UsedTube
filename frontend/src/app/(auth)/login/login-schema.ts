import * as yup from "yup";
import { UserCredentials } from "../../../types";

export const schema = yup.object<UserCredentials, any>().shape({
  username: yup.string().required("Username is required.").min(4, "Username must be at least 4 characters long."),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});
