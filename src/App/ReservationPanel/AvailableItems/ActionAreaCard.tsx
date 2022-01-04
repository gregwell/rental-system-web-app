import { Typography, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import CustomIcon from "../../general/CustomIcon";
import { ItemPrice, ItemType, Item } from "../../constants/types";

const useStyles = makeStyles({
  rootContainer: {
    textAlign: "center",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
  },
  dataContainer: {
    backgroundColor: "#001327",
    width: "100%",
    color: "white",
  },
  price: {
    paddingTop: "15px",
    color: "white",
    backgroundColor: "#001327",
    width: "100%",
    paddingBottom: "20px",
  },
  name: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  sizes: {
    backgroundColor: "#003a78",
    width: "100%",
    paddingLeft: "15px",
    paddingBottom: "20px",
    minHeight: "110px",
  },
  title: {
    paddingTop: "10px",
    paddingBottom: "15px",
  },
  icon: {
    transform: "scale(1.5)",
  },
  caption: {
    paddingBottom: "10px",
  },
  sizesCaption: {
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: "#003a78",
    color: "white",
  },
});

interface ActionAreaCardProps {
  producer: string;
  model: string;
  type: ItemType;
  pricesTable: ItemPrice[] | null;
  differentSizeItems: Item[];
  onSizeClick: (item: Item) => void;
}

const ActionAreaCard = ({
  producer,
  model,
  type,
  pricesTable,
  differentSizeItems,
  onSizeClick,
}: ActionAreaCardProps) => {
  const classes = useStyles();

  const itemPrice = pricesTable?.find((priceItem) => priceItem.type === type);

  return (
    <Grid container className={classes.rootContainer}>
      <Grid item className={classes.dataContainer}>
        <Grid container>
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h5">{producer}</Typography>
            <Typography variant="h5">{model}</Typography>
          </Grid>
          <Grid item xs={12} className={classes.icon}>
            <CustomIcon type={type} />
          </Grid>
          <Grid item xs={12} className={classes.caption}>
            <Typography variant="caption">{type}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} className={classes.sizesCaption}>
        <Typography>dostępne rozmiary:</Typography>
      </Grid>

      <Grid item className={classes.sizes}>
        <Grid container spacing={2}>
          {differentSizeItems.map((item) => (
            <Grid item>
              <Button variant="contained" onClick={() => onSizeClick(item)}>
                {item.size}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item className={classes.price}>
        <Typography variant="h5">
          <strong>{`${itemPrice?.price} zł` || "cena zł"}</strong>
        </Typography>
        <Typography variant="caption">
          {`Cena za ${itemPrice?.howMuch} ${
            itemPrice?.isPerDay ? "dni" : "godzin"
          } wynajmu.`}
        </Typography>
        <br />
        <Typography variant="caption">
          {`Stawka ${itemPrice?.isPerDay ? "dzienna" : "godzinna"}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ActionAreaCard;
