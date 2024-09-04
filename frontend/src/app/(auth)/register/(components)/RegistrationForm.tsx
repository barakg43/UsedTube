"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { schema } from "../registration-schema";
import {
    CONFIRMPASSWORD,
    EMAIL,
    FIRSTNAME,
    LASTNAME,
    PASSWORD,
    USERNAME,
} from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import {
    UserValues,
    registerUserData,
    setFormData,
} from "@/redux/slices/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegistrationForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
        clearErrors,
    } = useForm<UserValues>({
        //@ts-ignore
        resolver: yupResolver<UserValues>(schema),
    });

    const onSubmit: SubmitHandler<UserValues> = async (data: UserValues) => {
        dispatch(registerUserData(data));
        router.push("/providers");
    };

    const validateNotExisting = async (field: string, value: string) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_HOST}account/validate`,
                {
                    [field]: value,
                }
            );
            return { valid: true, message: response.data.message };
        } catch (error: any) {
            return { valid: false, message: error.response.data.error };
        }
    };

    const onBlur = async (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
    ) => {
        const results = await validateNotExisting(
            e.target.name,
            e.target.value
        );
        if (!results.valid) {
            //@ts-ignore
            setError(e.target.name, {
                type: "manual",
                message: results.message,
            });
        } else {
            //@ts-ignore
            clearErrors(e.target.name);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-7 flex-col items-center justify-center">
                    <Typography
                        variant="h5"
                        className="mt-4 mb-4 font-poetsen text-dustyPaperDarkest"
                    >
                        Register
                    </Typography>

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="first name"
                                size="small"
                                helperText={
                                    errors[FIRSTNAME]
                                        ? errors[FIRSTNAME].message
                                        : ""
                                }
                                error={errors[FIRSTNAME] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={FIRSTNAME}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="last name"
                                size="small"
                                helperText={
                                    errors[LASTNAME]
                                        ? errors[LASTNAME].message
                                        : ""
                                }
                                error={errors[LASTNAME] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={LASTNAME}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={EMAIL}
                                onBlur={onBlur}
                                size="small"
                                helperText={
                                    errors[EMAIL] ? errors[EMAIL].message : ""
                                }
                                error={errors[EMAIL] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={EMAIL}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={USERNAME}
                                onBlur={onBlur}
                                size="small"
                                helperText={
                                    errors[USERNAME]
                                        ? errors[USERNAME].message
                                        : ""
                                }
                                error={errors[USERNAME] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={USERNAME}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={PASSWORD}
                                size="small"
                                sx={{ width: "200px" }}
                                type={showPassword ? "text" : PASSWORD}
                                helperText={
                                    errors[PASSWORD]
                                        ? errors[PASSWORD].message
                                        : ""
                                }
                                error={errors[PASSWORD] ? true : false}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => {
                                                setShowPassword(!showPassword);
                                            }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
                        )}
                        //@ts-ignore
                        name={PASSWORD}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="confirm password"
                                type={showPassword ? "text" : PASSWORD}
                                size="small"
                                helperText={
                                    errors[CONFIRMPASSWORD]
                                        ? errors[CONFIRMPASSWORD].message
                                        : ""
                                }
                                error={errors[CONFIRMPASSWORD] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        //@ts-ignore
                        name={CONFIRMPASSWORD}
                        control={control}
                    />

                    <Button variant="contained" className="mb-4" type="submit">
                        {"Continue"}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default RegistrationForm;
