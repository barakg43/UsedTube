"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserCredentials } from "../../../../types";
import { schema } from "../login-schema";
import { password, username } from "@/constants";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginRequest, setAuthToken } from "@/redux/slices/generalSlice";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<UserCredentials>({
    //@ts-ignore
    resolver: yupResolver<UserCredentials>(schema),
  });

  const onSubmit: SubmitHandler<UserCredentials> = async (data: UserCredentials) => {
    const response = await dispatch(loginRequest(data)); // Dispatch the loginRequest thunk action creator
    console.log(response);
    if (response.payload.token) {
      dispatch(setAuthToken(response.payload.token));
      router.push("/drive");
    } else {
      setError("password", { message: "Invalid username or password" });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="absolute top-[30%] w-full flex flex-col gap-7 items-center justify-center">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue=""
                label={username}
                size="small"
                error={errors[password] ? true : false || errors[username] ? true : false}
                helperText={errors[username] ? errors[username].message : ""}
                sx={{ width: "200px" }}
              />
            )}
            name={username}
            control={control}
          />

          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue=""
                label="Password"
                size="small"
                sx={{ width: "200px" }}
                type={showPassword ? "text" : password}
                helperText={errors[password] ? errors[password].message : ""}
                error={errors[password] ? true : false}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            )}
            name={password}
            control={control}
          />
          <Button variant="contained" className="mb-4" type="submit">
            Login
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
