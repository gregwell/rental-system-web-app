import { makeStyles } from "@mui/styles";
import {
  Autocomplete,
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";

const useStyles = makeStyles({
  root: {
    paddingTop: "15px",
  },
  container: {
    backgroundColor: "white",
  },
  item: {
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingRight: "15px",
    textAlign: "right",
  },
  main: {
    paddingTop: "15px",
    paddingBottom: "15px",
    textAlign: "right",
  },
});

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item className={classes.main} xs={7}>
          <Typography variant="h5">Footer</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
