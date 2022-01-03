import { Typography, Container, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SingleReservation from "./SingleReservation";
import SingleRental from "./SingleRental";
import {
  Reservation,
  User,
  Item,
  Status,
  Rental,
  Price,
} from "../general/types";
import AccessGuard from "../general/AccessGuard";

const useStyles = makeStyles({
  panel: {
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "80px",
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
  },
});

interface MyReservationsProps {
  reservations: Reservation[] | null;
  newReservationSuccess: boolean | null;
  loggedUser: User | null | undefined;
  items: Item[] | null;
  apiDataInitialized: boolean;
  rentals: Rental[];
  prices: Price[];
}

const MyReservations = ({
  loggedUser,
  reservations,
  newReservationSuccess,
  items,
  prices,
  rentals,
  apiDataInitialized,
}: MyReservationsProps) => {
  const classes = useStyles();

  if (reservations && reservations.length > 0) {
    reservations?.push(
      reservations.splice(
        reservations.findIndex((v) => v?.status === Status.cancelled),
        1
      )[0]
    );
  }

  const loggedUserRentals = rentals.filter(
    (rental) => rental.userId === loggedUser?._id
  );

  return (
    <AccessGuard wait={loggedUser === undefined} deny={loggedUser === null}>
      <AccessGuard wait={!apiDataInitialized}>
        <div className={classes.panel}>
          <Container className={classes.reservation}>
            <Typography variant="h5">
              Aktualne rezerwacje i wypożyczenia:
            </Typography>
            <div className={classes.alert}>
              {newReservationSuccess === true && (
                <Alert severity="success">
                  <AlertTitle>
                    Rezerwacja została dokonana pomyślnie!
                  </AlertTitle>
                  Potwierdzenie możesz znaleźć w swojej skrzynce email.
                </Alert>
              )}
            </div>

            {loggedUserRentals.map((rental) => (
              <SingleRental
                key={rental._id}
                rental={rental}
                item={items?.find(
                  (item) => item.productId === rental.productId
                )}
                prices={prices}
              />
            ))}

            {!!reservations &&
              reservations
                .filter(
                  (reservation) => parseInt(reservation.startDate) > Date.now()
                )
                .sort(function (a, b) {
                  return parseInt(a.startDate) - parseInt(b.startDate);
                })
                .map((reservation) => {
                  return (
                    loggedUser &&
                    reservation.userId === loggedUser._id && (
                      <SingleReservation
                        key={reservation._id}
                        reservation={reservation}
                        item={items?.find(
                          (item) => item.productId === reservation.productId
                        )}
                      />
                    )
                  );
                })}
            <div className={classes.justPadding} />
            <Typography variant="h5" className={classes.alert}>
              Rezerwacje i wypożyczenia archiwalne:
            </Typography>
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
                        item={items?.find(
                          (item) => item.productId === reservation.productId
                        )}
                      />
                    )
                  );
                })}
          </Container>
        </div>
      </AccessGuard>
    </AccessGuard>
  );
};

export default MyReservations;
