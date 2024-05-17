"use client";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserCredentials } from "../../../../types";
import { schema } from "../login-schema";
import { password, username } from "@/constants";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginRequest, setAuthToken } from "@/redux/slices/generalSlice";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authToken = useAppSelector((state) => state.general.authToken);
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<UserCredentials>({
    //@ts-ignore
    resolver: yupResolver<UserCredentials>(schema),defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (authToken) {
      router.push("/drive");
    }
  }, [authToken, router]);
  
  const onSubmit: SubmitHandler<UserCredentials> = async (
    data: UserCredentials
  ) => {
    const response = await dispatch(loginRequest(data)); // Dispatch the loginRequest thunk action creator
    if (response.type === "account/login/rejected") {
      setError(password, { message: "Invalid username or password" });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='absolute top-[30%] w-full flex flex-col gap-7 items-center justify-center'>
        <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label={username}
                size='small'
                error={
                  errors[password]
                    ? true
                    : false || errors[username]
                    ? true
                    : false
                }
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
                defaultValue=''
                label={password}
                size='small'
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
        <Button variant='contained' className='mb-4' type='submit'>
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
