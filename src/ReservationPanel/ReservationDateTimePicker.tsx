import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@mui/material";

interface ReservationDateTimePickerProps {
  value: Date | null;
  setValue: (value: Date) => void;
  label: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export const ReservationDateTimePicker = ({
  value,
  setValue,
  label,
  minDate,
  maxDate,
}: ReservationDateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        disablePast
        label={label}
        value={value}
        onChange={(newValue) => {
          if (newValue !== null) {
            setValue(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} />}
        ampm={false}
        minDate={minDate ? minDate : undefined}
        maxDate={maxDate ? maxDate : undefined}
      />
    </LocalizationProvider>
  );
};
