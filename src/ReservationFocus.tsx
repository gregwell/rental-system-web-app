import { Typography, Grid, Alert, AlertTitle } from "@mui/material";
import { Reservation, Item, ItemType, Status, User } from "./general/types";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import CustomContainer from "./general/CustomContainer";
import CustomIcon from "./general/CustomIcon";
import { formatDate } from "./utils";
import { colors } from "./general/colors";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useStyles = makeStyles({
  focus: {
    height: "100px",
    width: "100px",
    backgroundColor: "red",
  },
  singlePanel: {
    paddingTop: "12px",
    cursor: "pointer",
  },
  singleReservation: {
    background: (makeStylesProps: {
      isCancelled: boolean;
      isArchived: boolean;
    }) => {
      if (makeStylesProps.isCancelled) {
        return "#bebebe";
      }
      if (makeStylesProps.isArchived) {
        return "black";
      }
      return "linear-gradient(to right, #0575e6, #1F38A1)";
    },
    paddingTop: "30px",
    borderRadius: "5px",
    paddingBottom: "30px",
    opacity: (makeStylesProps: { isCancelled: boolean; isArchived: boolean }) =>
      makeStylesProps.isArchived ? "20%" : "100%",
    "&:hover": {
      opacity: "100%",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
  },
  reservationText: {
    color: (makeStylesProps: { isCancelled: boolean; isArchived: boolean }) =>
      makeStylesProps.isCancelled ? "#787878" : "white",
    textAlign: "left",
  },
  singleReservationItem: {
    backgroundColor: "#001428",
    borderRadius: "3px",
    padding: "10px 0",
  },
  lastItem: {
    textAlign: "right",
  },
  white: {
    textColor: "white",
  },
  icon: {
    paddingTop: "20px",
    paddingLeft: "40px",
  },
  alert: {
    textAlign: "left",
  },
});

interface ReservationFocusProps {
  reservations: Reservation[] | null;
  items: Item[] | null;
  loggedUser: User | null;
}

export const ReservationFocus = ({
  reservations,
  items,
  loggedUser,
}: ReservationFocusProps) => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const reservation = reservations?.find((r) => r._id === _id);
  const item = items?.find((i) => i.productId === reservation?.productId);

  const makeStylesProps = {
    isCancelled: reservation?.status === Status.anulowana ? true : false,
    isArchived: parseInt(reservation?.startDate as string) < Date.now(),
  };

  console.log(reservations);
  console.log(reservation);
  console.log(item);

  const classes = useStyles(makeStylesProps);

  useEffect(() => {
    if (!loggedUser) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [loggedUser, navigate]);

  const startDateFormatted = formatDate(reservation?.startDate);
  const finishDateFormatted = formatDate(reservation?.finishDate);

  const getBgColor = (status: Status | undefined): string => {
    switch (status) {
      case Status.anulowana:
        return colors.cancelled;
      case Status.potwierdzona:
        return parseInt(reservation?.startDate as string) > Date.now()
          ? colors.confirmed
          : colors.confirmedArchived;
      default:
        return "white";
    }
  };

  return (
    <>
      <CustomContainer
        backgroundColor={loggedUser ? getBgColor(reservation?.status) : "white"}
      >
        {!!loggedUser ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={3} sm={3} md={2} lg={1.5}>
                <div className={classes.reservationText}>
                  <div className={classes.icon}>
                    <CustomIcon type={item?.type as ItemType} scale={"3.5"} />
                  </div>
                </div>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h3" className={classes.reservationText}>
                  {item && `${item.producer} ${item.model}`}
                </Typography>
              </Grid>
              <Grid item xs={8} sm={5} md={6} lg={5.5}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      className={classes.reservationText}
                    >
                      {item && `Rozmiar: ${item.size}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={12}>
                    <Typography
                      variant="h5"
                      className={classes.reservationText}
                    >
                      {`Data odbioru: ${startDateFormatted}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={12}>
                    <Typography
                      variant="h5"
                      className={classes.reservationText}
                    >
                      {`Data zwrotu: ${finishDateFormatted}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={12}>
                    <Typography
                      variant="h5"
                      className={classes.reservationText}
                    >
                      {`Cena: ${reservation?.price as string} zł`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={12}
                    className={classes.reservationText}
                  >
                    <Typography
                      variant="h5"
                      className={classes.reservationText}
                    >
                      {`Status: ${reservation?.status}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Alert severity="warning" className={classes.alert}>
              <AlertTitle>Brak dostępu!</AlertTitle>Zostaniesz przeniesiony na
              główną stronę
            </Alert>
          </>
        )}
      </CustomContainer>
    </>
  );
};

export default ReservationFocus;
