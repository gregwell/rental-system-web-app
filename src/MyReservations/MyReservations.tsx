import { Typography, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SingleReservation from "./SingleReservation";
import { Reservation } from "../general/types";

const useStyles = makeStyles({
  panel: {
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  reservation: {
    backgroundColor: "white",
    padding: "20px 0",
    borderRadius: "10px",
    paddingBottom: "25px",
  },
});

interface MyReservationsProps {
  reservations: Reservation[] | null;
}

const MyReservations = ({ reservations }: MyReservationsProps) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <Typography variant="h5">Twoje rezerwacje:</Typography>
          <SingleReservation title />
          {!!reservations &&
            reservations.map((reservation) => (
              <SingleReservation
                key={reservation._id}
                reservation={reservation}
              />
            ))}
        </Container>
      </div>
    </>
  );
};

export default MyReservations;
