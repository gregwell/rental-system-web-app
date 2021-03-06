import { Typography, Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useNavigate } from "react-router-dom";

import { formatDate } from "../utils";
import { Rental, Item, ItemType, Price, Path } from "../constants/types";
import CustomIcon from "../general/CustomIcon";
import { colors } from "../constants/colors";
import { calculateReservationPriceForEachType } from "../ReservationPanel/utils";
import RentalPriceDisplay from "./RentalPriceDisplay";

const useStyles = makeStyles({
  singlePanel: {
    paddingTop: "12px",
    cursor: "pointer",
  },
  singleReservation: {
    background: (makeStylesProps: { isArchived: boolean }) => {
      if (makeStylesProps.isArchived) {
        return colors.confirmedArchived;
      }
      return colors.rental;
    },
    paddingTop: "30px",
    borderRadius: "5px",
    paddingBottom: "30px",
    opacity: (makeStylesProps: { isArchived: boolean }) =>
      makeStylesProps.isArchived ? "20%" : "100%",
    "&:hover": {
      opacity: "100%",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
  },
  reservationText: {
    color: "white",
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
  rental: Rental;
  item: Item | undefined;
  prices: Price[];
}

const SingleRental = ({ rental, item, prices }: SingleReservationProps) => {
  const startDateFormatted = formatDate(rental?.startDate);

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`${Path.singleRental}/${rental?._id}`);
  };

  const makeStylesProps = {
    isArchived: rental?.status !== "true",
  };

  const priceTable = calculateReservationPriceForEachType(
    prices,
    new Date(parseInt(rental.startDate)),
    new Date(Date.now())
  );

  const priceData = priceTable?.find(
    (priceItem) => priceItem.type === item?.type
  );
  console.log(priceData);

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
                    {`Rozpocz??to: ${startDateFormatted}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  className={classes.reservationText}
                ></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={5} className={classes.lastItem}>
              <RentalPriceDisplay priceData={priceData} rental={rental} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default SingleRental;
