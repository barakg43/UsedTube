import { SxProps, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import * as yup from "yup";

interface InputFieldProps {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password';
    autoComplete?: string;
    validation?: yup.Schema; // Optional validation schema
    errors: any; // Add errors prop to access validation errors
    register: UseFormRegister<any>; // Add register prop to access register function
    props?: any;
    sx?: SxProps;
    InputProps?: any;
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    type = 'text',
    autoComplete,
    errors, // Access errors from props
    register, // Access register function from props
    ...props
}) => {

    const handleError = (errorName: string) => !!errors[errorName];
    const errorMessage = (errorName: string) => errors[errorName]?.message;

    return (
        <div  className="mb-5 flex flex-col">
            <TextField
                {...register(name)} // Assuming this comes from a parent component using useForm
                label={label}
                type={type}
                autoComplete={autoComplete}
                error={handleError(name)}
                helperText={errorMessage(name)}
                {...props}
                size="small"
            />
        </div>
    );
};


export default InputField;