import { Typography } from "@mui/material";
import { Reservation } from "./general/types";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import CustomContainer from "./general/CustomContainer";

const useStyles = makeStyles({
  focus: {
    height: "100px",
    width: "100px",
    backgroundColor: "red",
  },
});

interface ReservationFocusProps {
  reservations: Reservation[] | null;
}

export const ReservationFocus = ({ reservations }: ReservationFocusProps) => {
  const { _id } = useParams();

  const classes = useStyles();

  const reservation = reservations?.find((r) => (r._id = _id));

  return (
    <CustomContainer>
      <Typography variant="h4" children={`${reservation?.startDate}`} />
    </CustomContainer>
  );
};

export default ReservationFocus;
