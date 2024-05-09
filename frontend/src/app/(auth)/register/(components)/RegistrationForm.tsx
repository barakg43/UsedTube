import React, { useState } from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button, Modal } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import api_root from "@/config";
import { UserValues } from "../../../../types";
import { schema } from "../registration-schema";

const firstName = "firstName";
const lastName = "lastName";
const email = "email";
const username = "username";
const password = "password";
const confirmPassword = "confirmPassword";

const RegistrationForm: React.FC<{ setIsRegistered: Function }> = ({ setIsRegistered }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState<string | boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserValues>({
    //@ts-ignore
    resolver: yupResolver<UserValues>(schema),
  });

  const onSubmit: SubmitHandler<UserValues> = async (data: UserValues) => {
    const response = await axios.post(`http://${api_root}/account/register`, data).catch(function (error) {
      setErrorFromServer(error.response.data.error);
    });
    if (response) {
      setErrorFromServer(false);
      setIsRegistered(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-7 flex-col items-center justify-center">
          <h2 className="mt-4 mb-4">Register</h2>
          {errorFromServer && <div className="text-red-500">{errorFromServer}</div>}
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
              //@ts-ignore
              name={lastName}
              control={control}
            />
            {errors[lastName] && <div className="text-red-500">{errors[lastName].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => <TextField {...field} label="email" size="small" sx={{ width: "200px" }} />}
              //@ts-ignore
              name={email}
              control={control}
            />
            {errors[email] && <div className="text-red-500">{errors[email].message}</div>}
          </div>

          <div>
            <Controller
              render={({ field }) => <TextField {...field} label="username" size="small" sx={{ width: "200px" }} />}
              //@ts-ignore
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
                  label="password"
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
