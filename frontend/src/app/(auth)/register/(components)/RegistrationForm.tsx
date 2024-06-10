"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserValues } from "../../../../types";
import { schema } from "../registration-schema";
import { validateNotExisting } from "@/redux/slices/api";
import {
    CONFIRMPASSWORD,
    EMAIL,
    FIRSTNAME,
    LASTNAME,
    PASSWORD,
    USERNAME,
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
        clearErrors,
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
        } else {
            //@ts-ignore
            clearErrors(e.target.name);
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
                        {"Let's get API key"}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default RegistrationForm;
