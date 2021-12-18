import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";

interface ReservationDateTimePickerProps {
  value: Date | null;
  setValue: (value: Date) => void;
  label: string;
}

export const ReservationDateTimePicker = ({
  value,
  setValue,
  label,
}: ReservationDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          if (newValue !== null) {
            setValue(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} />}
        ampm={false}
      />
    </LocalizationProvider>
  );
};
