import { Typography, Container, Alert, AlertTitle, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SingleReservation from "./SingleReservation";
import { Reservation, User, Item } from "../general/types";
import CollapsibleTable from "./CollapsibleTable";

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
  items: Item[] | null;
}

const MyReservations = ({
  loggedUser,
  reservations,
  newReservationSuccess,
  items,
}: MyReservationsProps) => {
  const classes = useStyles();

  return (
    items && (
      <>
        <div className={classes.panel}>
          <Container className={classes.reservation}>
            <Typography variant="h5">Twoje rezerwacje:</Typography>
            <div className={classes.alert}>
              {newReservationSuccess === true && (
                <Alert severity="success">
                  <AlertTitle>
                    Rezerwacja została dokonana pomyślnie!
                  </AlertTitle>
                  Dziękujemy za zaufanie.
                </Alert>
              )}
            </div>

            {!!reservations &&
              reservations.map((reservation) => {
                console.log(reservation);
                console.log(items);
                return (
                  loggedUser &&
                  reservation.userId === loggedUser._id && (
                    <SingleReservation
                      key={reservation._id}
                      reservation={reservation}
                      item={items.find(
                        (item) => item.productId === reservation.productId
                      )}
                    />
                  )
                );
              })}
          </Container>
        </div>
      </>
    )
  );
};

export default MyReservations;
