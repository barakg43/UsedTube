import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as yup from "yup";
import InputField from './InputField';
import axios from 'axios';
import api_root from '@/config';
import { json } from 'stream/consumers';


type FormValues = {
  username:string,
  password: string,
  confirmPassword: string,
  email: string,
  firstName: string,
  lastName: string
}

const schema = yup.object<FormValues, any>().shape({
  username: yup.string().required('Username is required.'),
  email: yup.string().email().required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long'),
  firstName: yup.string()
    .required('First name is required')
    .matches(/^[a-zA-Z]+$/, 'This field can only contain letters'),
  lastName: yup.string()
    .required('Last name is required')
    .matches(/^[a-zA-Z]+$/, 'This field can only contain letters'),
  confirmPassword: yup
    .string()
    .required('Please retype your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});



const firstName = "firstName"
const lastName = "lastName"
const email = "email"
const userName = "userName"
const password = "password"

const RegistrationForm: React.FC = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(schema)});

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const json_data = JSON.stringify(data)
      console.log(json_data)
      const response = await axios.post(`http://${api_root}/account/register`, data);
      if (response.status !== 200) {
        setErrorMessage(response.data.message)
      } else {
        setErrorMessage(response.data.error)
      }
      console.log(response.data)
    } catch (error: any){
      setErrorMessage("WTF DUDE!")
    }
  };

  

  return (
  <>
    <div className='flex flex-col items-center'>
      <h2 className='mt-4 mb-4'>Lets register</h2>
      {errorMessage && <p className="text-red-500 mb-7">{errorMessage}</p>}
      <InputField
        name={firstName}
        label="First Name"
        register={register}
        errors={errors}
      />
      <InputField
        name={lastName}
        label="Last Name"
        register={register}
        errors={errors}
      />
      <InputField
        name={email}
        label="Email"
        autoComplete='email'
        type={email}
        register={register}
        errors={errors}
      />
      <InputField
        name={userName}
        label="Username"
        autoComplete='username'
        register={register}
        errors={errors}
      />
      <InputField
        name={password}
        label="Password"
        type={showPassword ? "text" : password}
        register={register}
        errors={errors}
        InputProps={{
          endAdornment: (
            <IconButton onClick={()=>{setShowPassword(!showPassword)}}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <InputField
        name="confirmPassword"
        label="Confirm Password"
        type={password}
        register={register}
        errors={errors}
      />
    </div>
    
    <Button
      className='fixed bottom-4 right-4'
      variant='contained'
      onClick={handleSubmit(onSubmit)}
    >submit</Button>

    
    </>
  );
};

export default RegistrationForm;


function createTag(fieldName: string){
  return fieldName+"-input"
}