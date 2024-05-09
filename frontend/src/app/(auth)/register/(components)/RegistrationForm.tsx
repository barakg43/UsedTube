"use client";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserValues } from "../../../../types";
import { schema } from "../registration-schema";
import validateNotExisting from "@/redux/api";
import { confirmPassword, email, firstName, lastName, password, username } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFormData } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

const RegistrationForm: React.FC<{ setIsFinishFillingForm: Function }> = ({ setIsFinishFillingForm }) => {
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

  const onBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    const results = await validateNotExisting(e.target.name, e.target.value);
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
          <h2 className="mt-4 mb-4">Register</h2>
          <div>
            <Controller
              render={({ field }) => <TextField {...field} label="first name" size="small" sx={{ width: "200px" }} />}
              name={firstName}
              control={control}
            />
            {errors[firstName] && <div className="text-red-500">{errors[firstName].message}</div>}
          </div>
          <div>
            <Controller
              render={({ field }) => <TextField {...field} label="last name" size="small" sx={{ width: "200px" }} />}
              name={lastName}
              control={control}
            />
            {errors[lastName] && <div className="text-red-500">{errors[lastName].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => (
                <TextField {...field} label={email} onBlur={onBlur} size="small" sx={{ width: "200px" }} />
              )}
              name={email}
              control={control}
            />
            {errors[email] && <div className="text-red-500">{errors[email].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => (
                <TextField {...field} label={username} onBlur={onBlur} size="small" sx={{ width: "200px" }} />
              )}
              name={username}
              control={control}
            />
            {errors[username] && <div className="text-red-500">{errors[username].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label={password}
                  size="small"
                  sx={{ width: "200px" }}
                  type={showPassword ? "text" : password}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
              //@ts-ignore
              name={password}
              control={control}
            />
            {errors[password] && <div className="text-red-500">{errors[password].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="confirm password"
                  type={showPassword ? "text" : password}
                  size="small"
                  sx={{ width: "200px" }}
                />
              )}
              //@ts-ignore
              name={confirmPassword}
              control={control}
            />
            {errors[confirmPassword] && <div className="text-red-500">{errors[confirmPassword].message}</div>}
          </div>
          <Button variant="contained" className="mb-4" type="submit">
            {"Let's get API key"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
