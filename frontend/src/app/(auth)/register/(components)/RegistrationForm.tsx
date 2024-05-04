import React from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
} from '@mui/material';

// Define the interface for form data type
interface FormValues {
  userName: string;
  password: string;
  retypedPassword: string;
  firstName: string;
  lastName: string;
  email: string;
}

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data); // Replace with your form submission logic
    // You can add validation logic in the onSubmit function as well
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            {...register('userName', {
              required: 'Username is required',
              minLength: 3,
              maxLength: 20,
              pattern: /^[a-zA-Z0-9]+$/, // Allow only alphanumeric characters
              errorMessage: 'Username can only contain letters and numbers (3-20 characters)',
            })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: 8, // Adjust minimum password length as needed
              pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])/, // Strong password pattern
              errorMessage:
                'Password must be at least 8 characters and include a lowercase letter, an uppercase letter, a number, and a special character',
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Retype Password"
            type="password"
            {...register('retypedPassword', {
              required: 'Retyped password is required',
              validate: {
                value: (value) =>
                  value === register('password').ref || 'Passwords do not match',
              },
            })}
            error={!!errors.retypedPassword}
            helperText={errors.retypedPassword?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="First Name"
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last Name"
            {...register('lastName', {
              required: 'Last name is required',
            })}
            error={!!errors.lastName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              validate: validateEmail, // Use the custom validation function
            })}
            error={!!errors.email}
            helperText={errors.email?.message} // Access the error message from the function
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegistrationForm;

const validateEmail = (value: string) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(value)) {
    return 'Invalid email format';
  }
  return undefined; // No error if email is valid
};