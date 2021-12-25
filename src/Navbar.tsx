import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { User } from "./ReservationPanel/types";
import { useNavigate } from "react-router-dom";

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

interface NavbarProps {
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
}

const Navbar = ({ users, loggedUser, setLoggedUser }: NavbarProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState<boolean>(false);

  const onButtonClick = () => {
    setShowAuth(!showAuth);
  };

  const signOut = () => {
    setLoggedUser(null);
    navigate("/");
  };

  const goToReservations = () => {
    navigate("/reservations");
  };

  useEffect(() => {
    if (loggedUser) {
      setShowAuth(false);
    }
  }, [loggedUser]);

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.main} xs={7}>
        <Typography variant="h5">System rezerwacji on-line</Typography>
      </Grid>
      <Grid item className={classes.item} xs={5}>
        {!loggedUser ? (
          <Button variant="contained" color="primary" onClick={onButtonClick}>
            Zaloguj się
          </Button>
        ) : (
          <>
            <Typography>{`Cześć ${loggedUser.name}!`}</Typography>
            <Button color="primary" onClick={signOut}>
              Wyloguj
            </Button>
            <Button color="primary" onClick={goToReservations}>
              Zarządzaj rezerwacjami
            </Button>
          </>
        )}
      </Grid>
      {!!showAuth && (
        <Auth
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
        />
      )}
    </Grid>
  );
};

export default Navbar;
