import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";

const useStyles = makeStyles({
  root: {
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

const Navbar = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.main} xs={7}>
        <Typography variant="h5">System rezerwacji on-line</Typography>
      </Grid>
      <Grid item className={classes.item} xs={5}>
        <Button variant="contained" color="primary">
          Zaloguj się
        </Button>
      </Grid>
    </Grid>
  );
};

export default Navbar;
