import { Typography, Container, Grid, Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { User } from "../General/types";
import SingleProfileItem from "./SingleProfileItem";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
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
    paddingBottom: "25px",
  },
  description: {
    paddingTop: "15px",
    textAlign: "right",
  },
  button: {
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
});

interface MyProfileProps {
  loggedUser: User | null;
}

const MyProfile = ({ loggedUser }: MyProfileProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  if (!loggedUser) {
    navigate("/");
  }

  return (
    <>
      {!!loggedUser && (
        <div className={classes.panel}>
          <Container className={classes.reservation}>
              <Typography variant="h5">Edycja profilu</Typography>
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} className={classes.center}>
                    <Typography variant="h6">Dane osobowe</Typography>
                  </Grid>
                  <SingleProfileItem caption="Imię" value={loggedUser.name} />
                  <SingleProfileItem
                    caption="Nazwisko"
                    value={loggedUser.surname}
                  />
                  <SingleProfileItem
                    caption="Numer telefonu"
                    value={loggedUser.phone}
                  />
                  <SingleProfileItem
                    caption="Adres email"
                    value={loggedUser.email}
                  />
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      aktualizuj
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                <Grid item xs={12} className={classes.center}>
                    <Typography variant="h6">Zmiana hasła</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Obecne hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nowe hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Powtórz hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      Zmień hasło
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </>
  );
};

export default MyProfile;
