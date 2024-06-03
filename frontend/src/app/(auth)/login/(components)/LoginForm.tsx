"use client";
import "@/app/globals.css";
import { password, username } from "@/constants";
import useLogin from "@/hooks/auth/useLogin";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UserCredentials } from "../../../../types";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<UserCredentials>();

  return (
    <form onSubmit={handleSubmit(login)}>
      <div className=' w-full flex flex-col gap-7 items-center justify-center'>
        <TextField
          defaultValue=''
          label={username}
          size='small'
          error={errors.username ? true : false}
          helperText={errors.username?.message ?? ""}
          sx={{ width: "200px" }}
          {...register(username, {
            required: "Username is required",
          })}
        />
        <TextField
          label='password'
          size='small'
          sx={{ width: "200px" }}
          type={showPassword ? "text" : "password"}
          helperText={errors[password] ? errors[password]?.message : ""}
          error={errors.password ? true : false}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          {...register(password, {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 32,
              message: "Password must be at most 32 characters",
            },
          })}
        />
        <Button
          variant='contained'
          className='mb-4'
          type='submit'
          disabled={isLoading}
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
