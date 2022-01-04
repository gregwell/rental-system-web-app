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
  rental?: Rental | null;
  priceData?: ItemPrice;
}

const RentalPriceDisplay = ({ rental, priceData }: RentalPriceDisplayProps) => {
  const classes = useStyles();

  if (!rental || rental?.status === "false" || !priceData) {
    return null;
  }

  return (
    <Typography className={classes.reservationText}>
      <Typography variant="h5">{`${priceData?.price} PLN`}</Typography>
      <Typography variant="overline">
        {`naliczone do tej pory / za ${priceData?.howMuch} ${
          priceData?.isPerDay ? "d." : "godz."
        }`}
      </Typography>
    </Typography>
  );
};

export default RentalPriceDisplay;
