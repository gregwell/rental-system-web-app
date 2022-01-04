import { Grid, Typography } from "@mui/material";
import { Rental, ItemPrice } from "../constants/types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  reservationText: {
    color: "white",
  },
  lastItem: {
    textAlign: "right",
  },
});

interface RentalPriceDisplayProps {
  rental?: Rental;
  priceData?: ItemPrice;
}

const RentalPriceDisplay = ({ rental, priceData }: RentalPriceDisplayProps) => {
  const classes = useStyles();

  if (!rental || rental?.status === "false" || !priceData) {
    return null;
  }

  return (
    <Grid item xs={12} sm={6} md={5} className={classes.lastItem}>
      <Typography className={classes.reservationText}>
        <Typography variant="h5">{`${priceData?.price} PLN`}</Typography>
        <Typography variant="overline">
          {`naliczone do tej pory / za ${priceData?.howMuch} ${
            priceData?.isPerDay ? "d." : "godz."
          }`}
        </Typography>
      </Typography>
    </Grid>
  );
};

export default RentalPriceDisplay;
