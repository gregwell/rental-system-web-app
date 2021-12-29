import { Typography, Container, Alert, AlertTitle, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import SingleReservation from "./SingleReservation";
import { Reservation, User, Item, Status } from "../general/types";
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
  justPadding: {
    paddingTop: "50px",
    paddingBottom: "30px",
  }
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
  const navigate = useNavigate();

  if (!loggedUser) {
    navigate("/");
  }

  reservations?.push(
    reservations.splice(
      reservations.findIndex((v) => v.status === Status.anulowana),
      1
    )[0]
  );

  return (
    items && (
      <>
        <div className={classes.panel}>
          <Container className={classes.reservation}>
            <Typography variant="h5">Aktualne rezerwacje i wypożyczenia:</Typography>
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
              reservations
                .filter(
                  (reservation) => parseInt(reservation.startDate) > Date.now()
                )
                .map((reservation) => {
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
                <div className={classes.justPadding}/>
                <Typography variant="h5" className={classes.alert}>Rezerwacje i wypożyczenia archiwalne:</Typography>
            {!!reservations &&
              reservations
                .filter(
                  (reservation) => parseInt(reservation.startDate) < Date.now()
                )
                .sort(function (a, b) {
                  return parseInt(b.startDate) - parseInt(a.startDate);
                })
                .map((reservation) => {
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
