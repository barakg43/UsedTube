"use client";
import { PASSWORD, USERNAME } from "@/constants";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserCredentials } from "../../../../types";
import "@/app/globals.css";
import useLogin from "@/hooks/auth/useLogin";

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        register,
        setError,
    } = useForm<UserCredentials>();
    const { login, isLoading } = useLogin(setError);

    return (
        <form onSubmit={handleSubmit(login)}>
            <div className=" w-full flex flex-col gap-7 items-center justify-center">
                <TextField
                    defaultValue=""
                    label={USERNAME}
                    size="small"
                    error={errors.username ? true : false}
                    helperText={errors.username?.message ?? ""}
                    sx={{ width: "200px" }}
                    {...register(USERNAME, {
                        required: "Username is required",
                    })}
                />
                <TextField
                    label="password"
                    size="small"
                    sx={{ width: "200px" }}
                    type={showPassword ? "text" : "password"}
                    helperText={
                        errors[PASSWORD] ? errors[PASSWORD]?.message : ""
                    }
                    error={errors.password ? true : false}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={() =>
                                    setShowPassword(
                                        (showPassword) => !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        ),
                    }}
                    {...register(PASSWORD, {
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
                    variant="contained"
                    className="mb-4"
                    type="submit"
                    disabled={isLoading}
                >
                    Login
                </Button>
            </div>
        </form>
    );
};

export default LoginForm;
