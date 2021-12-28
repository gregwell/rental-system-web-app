import { Typography, Container, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SingleReservation from "./SingleReservation";
import { Reservation, User } from "../general/types";

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
  alert: {
    paddingTop: "15px",
    paddingBottom: "5px",
  },
});

interface MyReservationsProps {
  reservations: Reservation[] | null;
  newReservationSuccess: boolean | null;
  loggedUser: User | null;
}

const MyReservations = ({
  loggedUser,
  reservations,
  newReservationSuccess,
}: MyReservationsProps) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <Typography variant="h5">Twoje rezerwacje:</Typography>
          <div className={classes.alert}>
            {newReservationSuccess === true && (
              <Alert severity="success">
                <AlertTitle>Rezerwacja została dokonana pomyślnie!</AlertTitle>
                Dziękujemy za zaufanie.
              </Alert>
            )}
          </div>

          <SingleReservation title />
          {!!reservations &&
            reservations.map((reservation) => {
              return (
                loggedUser &&
                reservation.userId === loggedUser._id && (
                  <SingleReservation
                    key={reservation._id}
                    reservation={reservation}
                  />
                )
              );
            })}
        </Container>
      </div>
    </>
  );
};

export default MyReservations;
