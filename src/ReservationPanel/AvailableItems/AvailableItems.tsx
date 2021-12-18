import { makeStyles } from "@mui/styles";
import { Grid, Typography, Container } from "@mui/material";
import ActionAreaCard from "./ActionAreaCard";
import { useCallback } from "react";
import { getPolishName } from "../utils";
import { Item } from "../types";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  panel: {
    width: "100%",
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  reservation: {
    backgroundColor: "#dedede",
    padding: "20px 0",
    borderRadius: "10px",
  },
  title: {
    paddingBottom: "15px",
  },
  button: {
    height: "55px",
    width: "100%",
  },
});

interface AvailableItemsProps {
  items: Item[];
  setIsShowingReservationForm: (value: boolean) => void;
  setChoosenItem: (value: Item) => void;
}

const AvailableItems = (props: AvailableItemsProps) => {
  const { items, setIsShowingReservationForm, setChoosenItem } = props;
  const classes = useStyles();

  const onCardClick = useCallback(
    (item) => {
      setIsShowingReservationForm(true);
      setChoosenItem(item);
    },
    [setChoosenItem, setIsShowingReservationForm]
  );

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          {items.length > 0 && (
            <div className={classes.title}>
              <Typography>Dostępny sprzęt:</Typography>
            </div>
          )}
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <div onClick={() => onCardClick(item)}>
                  <ActionAreaCard
                    name={`${item.producer} ${item.model}`}
                    type={getPolishName(item.type)}
                    imageUrl={item.photo}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default AvailableItems;
