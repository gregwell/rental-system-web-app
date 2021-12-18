import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

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
  name: string;
  type: string;
  imageUrl: string;
}

const ActionAreaCard = ({ name, type, imageUrl }: ActionAreaCardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
