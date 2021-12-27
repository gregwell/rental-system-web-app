import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";

import Auth from "./Auth";
import { User } from "./general/types";

const useStyles = makeStyles({
  root: {
    backgroundColor: "white",
    textAlign: "center",
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
  auth: {
    paddingBottom: "60px",
    paddingTop: "30px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  topBar: {
    height: "3px",
    backgroundColor: "#1B72CE",
    width: "100%",
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

  const goToHome = () => {
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (loggedUser) {
      setShowAuth(false);
    }
  }, [loggedUser]);

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.main} md={7} xs={12}>
        <div onClick={goToHome}>
          <Typography variant="h5">System rezerwacji on-line</Typography>
        </div>
      </Grid>
      <Grid item className={classes.item} md={5} xs={12}>
        {!loggedUser ? (
          <Button variant="contained" color="primary" onClick={onButtonClick}>
            {showAuth ? "Ukryj" : "Zaloguj się"}
          </Button>
        ) : (
          <>
            <Typography>{`Cześć ${loggedUser.name}!`}</Typography>
            <Button color="primary" onClick={goToReservations}>
              Zarządzaj rezerwacjami
            </Button>
            <Button color="primary" onClick={goToProfile}>
              Edytuj profil
            </Button>
            <Button color="primary" onClick={signOut}>
              Wyloguj
            </Button>
          </>
        )}
      </Grid>
      {!!showAuth && (
        <>
          <div className={classes.topBar} />
          <div className={classes.auth}>
            <Auth
              users={users}
              loggedUser={loggedUser}
              setLoggedUser={setLoggedUser}
            />
          </div>
        </>
      )}
    </Grid>
  );
};

export default Navbar;
