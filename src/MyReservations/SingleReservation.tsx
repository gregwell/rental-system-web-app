import { Typography, Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Route, Routes } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { formatDate } from "./utils";
import { Reservation, Item, ItemType } from "../general/types";
import CustomIcon from "../general/CustomIcon";
import ReservationFocus from "../ReservationFocus";

const useStyles = makeStyles({
  singlePanel: {
    paddingTop: "10px",
  },
  singleReservation: {
    /*backgroundColor: (makeStylesProps: { isTitle: boolean }) =>
      makeStylesProps.isTitle ? "white" : "green",*/
    background: "linear-gradient(to right, #0575e6, #1F38A1)",
    paddingTop: "30px",
    borderRadius: "5px",
    paddingBottom: "30px",
  },
  reservationText: {
    color: (makeStylesProps: { isTitle: boolean }) =>
      makeStylesProps.isTitle ? "black" : "white",
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

  const startDateFormatted = formatDate(
    new Date(parseInt(reservation?.startDate as string))
  );

  const finishDateFormatted = formatDate(
    new Date(parseInt(reservation?.finishDate as string))
  );

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/reservation/${reservation?._id}`);
  };

  const makeStylesProps = { isTitle: isTitle };
  const classes = useStyles(makeStylesProps);
  return (
    <>
      <div className={classes.singlePanel}>
        <Container className={classes.singleReservation} onClick={onClick}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.white}>
                {item &&
                  `${item.producer} ${item.model} (rozmiar: ${item.size})`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <div className={classes.white}>
                <CustomIcon type={item?.type as ItemType} />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography className={classes.reservationText}>
                {item?._id as string}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography className={classes.reservationText}>
                {startDateFormatted}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography className={classes.reservationText}>
                {finishDateFormatted}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography className={classes.reservationText}>
                {`${reservation?.price as string} zł`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2} className={classes.lastItem}>
              <Typography className={classes.reservationText}>
                {reservation?.status || "Status"}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default SingleReservation;
