'use client';
import { TextField } from "@mui/material";

// Define the type for the props
interface FormTextFieldProps {
    label: string;
    value: string;
    error: string | undefined;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormTextField : React.FC<FormTextFieldProps> = ({ label, value, error, disabled, onChange}) => (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      disabled={disabled}
      margin="normal"
      sx={{
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#000000",
        },
        "& .MuiInputLabel-root.Mui-disabled": {
          color: "#000000",
        },
      }}
    />
  );

  export default FormTextField;
  