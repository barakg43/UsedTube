"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserCredentials } from "../../../../types";
import { schema } from "../login-schema";
import { password, username } from "@/constants";
import { login } from "@/redux/api";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    const response = await login(data.username, data.password);
    if (response.error) {
      setError(password, {
        type: "manual",
        message: response.message,
      });
    } else {
      router.push("/drive");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-7 flex-col items-center justify-center">
          <h2 className="mt-4 mb-4">Login</h2>

          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label={username}
                size="small"
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
                label="Password"
                size="small"
                sx={{ width: "200px" }}
                type={showPassword ? "text" : password}
                helperText={errors[password] ? errors[password].message : ""}
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
