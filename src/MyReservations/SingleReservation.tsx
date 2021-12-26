import { Typography, Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Reservation } from "../General/types";

const useStyles = makeStyles({
  singlePanel: {
    paddingTop: "10px",
  },
  singleReservation: {
    backgroundColor: (makeStylesProps: { isTitle: boolean }) =>
      makeStylesProps.isTitle ? "white" : "green",
    padding: "10px 0",
    borderRadius: "15px",
    paddingBottom: "5 px",
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
});

interface SingleReservationProps {
  title?: boolean;
  reservation?: Reservation;
}

const SingleReservation = ({ title, reservation }: SingleReservationProps) => {
  const isTitle = title ? true : false;

  const makeStylesProps = { isTitle: isTitle };
  const classes = useStyles(makeStylesProps);
  console.log(classes);
  return (
    <div className={classes.singlePanel}>
      <Container className={classes.singleReservation}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography className={classes.reservationText}>
              {"Nazwa sprzętu"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography className={classes.reservationText}>
              {reservation?.startDate || "Data rozpoczęcia"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography className={classes.reservationText}>
              {reservation?.finishDate || "Data zakończenia"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography className={classes.reservationText}>
              {reservation?.price ? `${reservation?.price} zł` : "Cena"}
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
  );
};

export default SingleReservation;
