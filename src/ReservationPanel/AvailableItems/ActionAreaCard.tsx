import { Card, Typography, CardActionArea } from "@mui/material";
import { makeStyles } from "@mui/styles";

import CustomIcon from "../../general/CustomIcon";
import { ItemPrice, ItemType } from "../../general/types";

const useStyles = makeStyles({
  button: {
    width: "100%",
  },
  root: {
    textAlign: "center",
    backgroundColor: "red",
  },
  black: {
    paddingTop: "35px",
    paddingBottom: "15px",
    marginTop: "10px",
    color: "white",
    backgroundColor: "#444444",
  },
  icon: {
    paddingTop: "25px",
    paddingBottom: "10px",
    backgroundColor: "#deebff",
    transform: "scale(1.5)",
  },
  type: {
    fontSize: "10px",
    fontStyle: "italic",
  },
  name: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
});

interface ActionAreaCardProps {
  producer: string;
  model: string;
  type: ItemType;
  pricesTable: ItemPrice[] | null;
}

const ActionAreaCard = ({
  producer,
  model,
  type,
  pricesTable,
}: ActionAreaCardProps) => {
  const classes = useStyles();

  const itemPrice = pricesTable?.find((priceItem) => priceItem.type === type);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <div className={classes.icon}>
          <div className={classes.name}>
            <Typography>{producer}</Typography>
            <Typography>{model}</Typography>
          </div>
          <CustomIcon type={type} />
          <div className={classes.type}>{type}</div>
        </div>
        <div className={classes.black}>
          <Typography variant="h5">
            {`${itemPrice?.price} zł` || "cena zł"}
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
        </div>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
