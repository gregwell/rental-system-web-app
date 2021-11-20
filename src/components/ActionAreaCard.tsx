import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Button } from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  button: {
    width: "100%",
  },
  root: {
    textAlign: "center",
  },
});

interface ActionAreaCardProps {
  name: String;
}

const ActionAreaCard = ({ name }: ActionAreaCardProps) => {
  const classes = useStyles();

  const narty1 =
    "https://roweryczeladz.pl/userdata/public/gfx/23514/593d47c148d09f50c3ae71c3d84c.jpg";
  const narty2 =
    "https://snowsport.pl/oferta-02/1586442431_Narty-Atomic-Redster-S9+wiazanie-X-14-GW-2021-1.jpg";

  const random = Math.random();
  const narty = Math.round(random) === 0 ? narty1 : narty2;

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={narty}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Narty
          </Typography>
          <Button
            variant="contained"
            color="success"
            className={classes.button}
          >
            Sprawdź dostępność
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
