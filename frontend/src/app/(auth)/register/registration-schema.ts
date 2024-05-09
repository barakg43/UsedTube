import * as yup from "yup";
import { UserValues } from "../../../types";

export const schema = yup.object<UserValues, any>().shape({
  username: yup.string().required("Username is required.").min(4, "Longer than 4!"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z]+$/, "This field can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]+$/, "This field can only contain letters"),
  confirmPassword: yup
    .string()
    .required("Please retype your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
