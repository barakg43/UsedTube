import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as yup from "yup";
import InputField from './InputField';

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
  retypedPassword: yup
    .string()
    .required('Please retype your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});



const firstName = "firstName"
const lastName = "lastName"
const email = "email"
const userName = "username"
const password = "password"

const RegistrationForm: React.FC = () => {
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)});

  const onSubmit = (data: any) => {
    console.log(data); // Replace with your form submission logic
    // You can add validation logic in the onSubmit function as well
  };

  

  return (
  <div className='flex flex-col items-center'>
    <h2 className='mt-4 mb-4'>Lets register</h2>
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
      type={email}
      autoComplete={email}
      register={register}
      errors={errors}
    />
    <InputField
      name={userName}
      label="Username"
      register={register}
      errors={errors}
    />
    <InputField
      name={password}
      label="Password"
      type={showPassword ? "text" : password}
      autoComplete={password}
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
      autoComplete={password}
      register={register}
      errors={errors}
    />
    <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
  </div>
  );
};

export default RegistrationForm;


function createTag(fieldName: string){
  return fieldName+"-input"
}