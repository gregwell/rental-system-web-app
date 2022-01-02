import { useCallback } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, Container, Button } from "@mui/material";

import ActionAreaCard from "./ActionAreaCard";
import { Item, ItemPrice, GroupedItems } from "../../general/types";

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
  items: GroupedItems;
  setIsShowingReservationForm: (value: boolean) => void;
  setChoosenItem: (value: Item) => void;
  pricesTable: ItemPrice[] | null;
}

const AvailableItems = ({
  items,
  setIsShowingReservationForm,
  setChoosenItem,
  pricesTable,
}: AvailableItemsProps) => {
  const classes = useStyles();

  const onSizeClick = (item: Item) => {
    setIsShowingReservationForm(true);
    setChoosenItem(item);
  };

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.title}>
            <Typography>{`Dostępny sprzęt: ${
              Object.keys(items).length
            }`}</Typography>
          </div>

          <Grid container spacing={2}>
            {Object.entries(items).map(([uniqueModel, concreteItems]) => (
              <Grid item xs={12} sm={6} md={3} key={uniqueModel}>
                <ActionAreaCard
                  producer={concreteItems[0].producer}
                  model={concreteItems[0].model}
                  type={concreteItems[0].type}
                  pricesTable={pricesTable}
                  differentSizeItems={concreteItems.filter(
                    (item, index, self) =>
                      self.findIndex((i) => i.size === item.size) === index
                  )}
                  onSizeClick={onSizeClick}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default AvailableItems;
