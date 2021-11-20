import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  Container,
  Autocomplete,
  TextField,
} from "@mui/material";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { DateTimePicker } from "@mui/lab";

import ActionAreaCard from "./ActionAreaCard";
import { getHundredRandomSkiNames } from "./utils";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  panel: {
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  reservation: {
    backgroundColor: "white",
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

const ReservationPanel = () => {
  const classes = useStyles();

  const types = ["Narty", "Deski snowboardowe"];

  const names: String[] = getHundredRandomSkiNames();

  const handleChange = () => {};

  return (
    <div className={classes.root}>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.title}>
            <Typography>
              Wyszukaj dostępny sprzęt w wybranym terminie
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Autocomplete
                options={types}
                renderInput={(params) => (
                  <TextField {...params} label="Typ sprzętu" />
                )}
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={6} sm={4} md={2}>
                <DateTimePicker
                  label="Data odbioru"
                  value={null}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <DateTimePicker
                  label="Data zwrotu"
                  value={null}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={12} sm={4} md={2}>
              <Button variant="contained" className={classes.button}>
                Wyszukaj
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.title}>
            <Typography>Przglądaj sprzęt</Typography>
          </div>
          <Grid container spacing={2}>
            {names.map((name) => (
              <Grid item xs={12} sm={6} md={3}>
                <ActionAreaCard name={name} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default ReservationPanel;
