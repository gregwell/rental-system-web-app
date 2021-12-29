import { Typography, Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Route, Routes } from "react-router-dom";
import Countdown from "react-countdown";

import { useNavigate } from "react-router-dom";

import { formatDate } from "../utils";
import { Reservation, Item, ItemType, Status } from "../general/types";
import CustomIcon from "../general/CustomIcon";
import ReservationFocus from "../ReservationFocus";
import { useEffect } from "react";
import { colors } from "../general/colors";

const useStyles = makeStyles({
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
        return colors.cancelled;
      }
      if (makeStylesProps.isArchived) {
        return colors.confirmedArchived;
      }
      return colors.confirmed;
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
});

interface SingleReservationProps {
  title?: boolean;
  reservation?: Reservation;
  item: Item | undefined;
}

const SingleReservation = ({
  title,
  reservation,
  item,
}: SingleReservationProps) => {
  const isTitle = title ? true : false;

  const startDateFormatted = formatDate(reservation?.startDate);
  const finishDateFormatted = formatDate(reservation?.finishDate);

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/reservation/${reservation?._id}`);
  };

  const makeStylesProps = {
    isCancelled: reservation?.status === Status.anulowana ? true : false,
    isArchived: parseInt(reservation?.startDate as string) < Date.now(),
  };

  const diff = new Date(
    parseInt(reservation?.startDate as string) - Date.now()
  );

  var months = diff.getUTCMonth();
  var days = diff.getUTCDate() - 1;

  console.log(reservation);

  const classes = useStyles(makeStylesProps);
  return (
    <>
      <div className={classes.singlePanel} onClick={onClick}>
        <Container className={classes.singleReservation}>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={3} md={2} lg={1.5}>
              <div className={classes.reservationText}>
                <div className={classes.icon}>
                  <CustomIcon type={item?.type as ItemType} scale={"3.5"} />
                </div>
              </div>
            </Grid>
            <Grid item xs={8} sm={5} md={6} lg={5.5}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.reservationText}>
                    {item &&
                      `${item.producer} ${item.model} (rozmiar: ${item.size})`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={7}>
                  <Typography
                    className={classes.reservationText}
                    variant="caption"
                  >
                    {`${startDateFormatted} - ${finishDateFormatted}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Typography
                    variant="caption"
                    className={classes.reservationText}
                  >
                    {`${reservation?.price as string} zł`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  className={classes.reservationText}
                >
                  <Typography
                    className={classes.reservationText}
                    variant="caption"
                  >
                    {reservation?.status || "Status"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {!(reservation?.status === "cancelled") &&
              parseInt(reservation?.startDate as string) > Date.now() && (
                <Grid item xs={12} sm={6} md={5} className={classes.lastItem}>
                  <Typography className={classes.reservationText}>
                    <Typography display="inline" variant="h6">
                      za{" "}
                    </Typography>
                    <Typography display="inline" variant="h3">
                      {months}
                    </Typography>
                    <Typography display="inline" variant="h6">
                      {" "}
                      mies.{" "}
                    </Typography>
                    <Typography
                      display="inline"
                      variant="h3"
                    >{` ${days}`}</Typography>
                    <Typography display="inline" variant="h6">
                      {" "}
                      dni{" "}
                    </Typography>
                  </Typography>
                </Grid>
              )}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default SingleReservation;
