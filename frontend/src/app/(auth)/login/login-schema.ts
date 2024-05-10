import * as yup from "yup";
import { UserCredentials } from "../../../types";

export const schema = yup.object<UserCredentials, any>().shape({
  username: yup.string().required("Username is required.").min(4, "Longer than 4!"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});
