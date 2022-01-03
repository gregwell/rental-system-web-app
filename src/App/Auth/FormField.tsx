import { AuthFormFields } from "../constants/types";
import { TextField, Grid, GridSize } from "@mui/material";
import { getFormFieldName } from "./utils";

interface FormFieldProps {
  field: keyof AuthFormFields;
  user: AuthFormFields;
  setUser: (value: React.SetStateAction<AuthFormFields>) => void;
  narrow?: boolean;
}

const FormField = ({
  field,
  user,
  setUser,
  narrow,
}: FormFieldProps) => {
  return (
    <Grid item xs={12} md={narrow ? (6 as GridSize) : (12 as GridSize)}>
      <TextField
        label={getFormFieldName(field)}
        variant="outlined"
        fullWidth
        type={field.toLowerCase().includes("password") ? "password" : "text"}
        value={user[field]}
        onChange={(event) =>
          setUser((prevState) => {
            return { ...prevState, [field]: event.target.value };
          })
        }
      />
    </Grid>
  );
};

export default FormField;
