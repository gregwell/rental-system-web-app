import { Item } from "./types";
import { Typography } from "@mui/material";

interface ReservationConfirmationProps {
  choosenItem: Item;
  startDate: Date | null;
  finishDate: Date | null;
}

export const ReservationConfirmation = ({
  choosenItem,
  startDate,
  finishDate,
}: ReservationConfirmationProps) => {
  return (
    <>
      <Typography variant="h3">
        {`${choosenItem.producer} ${choosenItem.model}`}
      </Typography>
      <Typography>{`Odbiór: ${startDate}`}</Typography>
      <Typography>{`Koniec: ${finishDate}`}</Typography>
    </>
  );
};
