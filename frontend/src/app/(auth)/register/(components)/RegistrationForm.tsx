"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserValues } from "../../../../types";
import { schema } from "../registration-schema";
import { validateNotExisting } from "@/redux/api";
import {
    confirmPassword,
    email,
    firstName,
    lastName,
    password,
    username,
} from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFormData } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

const RegistrationForm: React.FC<{ setIsFinishFillingForm: Function }> = ({
    setIsFinishFillingForm,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const apiKey = useAppSelector((s: RootState) => s.user.apiKey);

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
    } = useForm<UserValues>({
        //@ts-ignore
        resolver: yupResolver<UserValues>(schema),
    });

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
        }
    };

    const onSubmit: SubmitHandler<UserValues> = async (data: UserValues) => {
        dispatch(setFormData({ ...data, apiKey }));
        setIsFinishFillingForm(true);
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
                                    errors[firstName]
                                        ? errors[firstName].message
                                        : ""
                                }
                                error={errors[firstName] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={firstName}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="last name"
                                size="small"
                                helperText={
                                    errors[lastName]
                                        ? errors[lastName].message
                                        : ""
                                }
                                error={errors[lastName] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={lastName}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={email}
                                onBlur={onBlur}
                                size="small"
                                helperText={
                                    errors[email] ? errors[email].message : ""
                                }
                                error={errors[email] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        name={email}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={username}
                                onBlur={onBlur}
                                size="small"
                                helperText={
                                    errors[username]
                                        ? errors[username].message
                                        : ""
                                }
                                error={errors[username] ? true : false}
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
                                label={password}
                                size="small"
                                sx={{ width: "200px" }}
                                type={showPassword ? "text" : password}
                                helperText={
                                    errors[password]
                                        ? errors[password].message
                                        : ""
                                }
                                error={errors[password] ? true : false}
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
                        name={password}
                        control={control}
                    />

                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="confirm password"
                                type={showPassword ? "text" : password}
                                size="small"
                                helperText={
                                    errors[confirmPassword]
                                        ? errors[confirmPassword].message
                                        : ""
                                }
                                error={errors[confirmPassword] ? true : false}
                                sx={{ width: "200px" }}
                            />
                        )}
                        //@ts-ignore
                        name={confirmPassword}
                        control={control}
                    />

                    <Button variant="contained" className="mb-4" type="submit">
                        {"Let's get API key"}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default RegistrationForm;
