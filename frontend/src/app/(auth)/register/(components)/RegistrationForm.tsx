import React, { useState } from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, IconButton, Button, Modal } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import api_root from "@/config";
import { FormValues } from "../types";
import { schema } from "../schema";
import OnRegistrationModal from "./OnRegistrationModal";
import { redirect } from "next/navigation";

const firstName = "firstName";
const lastName = "lastName";
const email = "email";
const username = "username";
const password = "password";
const confirmPassword = "confirmPassword";

const RegistrationForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState<string | boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver<FormValues>(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const response = await axios.post(`http://${api_root}/account/register`, data).catch(function (error) {
      setErrorFromServer(error.response.data.error);
    });
    if (response) {
      setErrorFromServer(false);
      redirect("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-7 flex-col items-center justify-center">
          <h2 className="mt-4 mb-4">Lets register</h2>
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
            submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
