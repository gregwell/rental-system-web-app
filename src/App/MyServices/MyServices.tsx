import { Typography, Container, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SingleReservation from "./SingleReservation";
import SingleRental from "./SingleRental";
import { StateProps, Status } from "../constants/types";
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

interface MyServicesProps extends StateProps {
  apiDataInitialized: boolean;
}

const MyServices = ({
  state,
  dispatch,
  apiDataInitialized,
}: MyServicesProps) => {
  const classes = useStyles();

  if (state.reservations && state.reservations.length > 0) {
    state.reservations?.push(
      state.reservations.splice(
        state.reservations.findIndex((v) => v?.status === Status.cancelled),
        1
      )[0]
    );
  }

  const loggedUserRentals = state.rentals.filter(
    (rental) => rental.userId === state.loggedUser?._id
  );

  return (
    <AccessGuard wait={state.loggedUser === undefined} deny={state.loggedUser === null}>
      <AccessGuard wait={!apiDataInitialized}>
        <div className={classes.panel}>
          <Container className={classes.reservation}>
            <Typography variant="h5">
              Aktualne rezerwacje i wypożyczenia:
            </Typography>
            <div className={classes.alert}>
              {state.newReservationSuccess === true && (
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
                item={state.items?.find(
                  (item) => item.productId === rental.productId
                )}
                prices={state.prices}
              />
            ))}

            {!!state.reservations &&
              state.reservations
                .filter(
                  (reservation) => parseInt(reservation.startDate) > Date.now()
                )
                .sort(function (a, b) {
                  return parseInt(a.startDate) - parseInt(b.startDate);
                })
                .map((reservation) => {
                  return (
                    state.loggedUser &&
                    reservation.userId === state.loggedUser._id && (
                      <SingleReservation
                        key={reservation._id}
                        reservation={reservation}
                        item={state.items?.find(
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
            {!!state.reservations &&
              state.reservations
                .filter(
                  (reservation) => parseInt(reservation.startDate) < Date.now()
                )
                .sort(function (a, b) {
                  return parseInt(b.startDate) - parseInt(a.startDate);
                })
                .map((reservation) => {
                  return (
                    state.loggedUser &&
                    reservation.userId === state.loggedUser._id && (
                      <SingleReservation
                        key={reservation._id}
                        reservation={reservation}
                        item={state.items?.find(
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

export default MyServices;
