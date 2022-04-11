import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BookIcon from "@mui/icons-material/Book";
import LoginIcon from "@mui/icons-material/Login";

import Auth from "../Auth/Auth";
import { Path, State, StateProps } from "../constants/types";
import { useStyles } from "./styles";

const Navbar = ({ state, dispatch }: StateProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState<boolean>(false);

  const onButtonClick = () => {
    setShowAuth(!showAuth);
  };

  const signOut = () => {
    dispatch((prev: State) => ({ ...prev, loggedUser: null }));
    localStorage.setItem("user", "");
    navigate(Path.home);
  };

  const eraseNewReservationSuccess = () => {
    dispatch((prev: State) => ({ ...prev, newReservationSuccess: null }));
  };

  const goToReservations = () => {
    eraseNewReservationSuccess();
    navigate(Path.services);
  };

  const goToHome = () => {
    eraseNewReservationSuccess();
    navigate(Path.home);
  };

  const goToProfile = () => {
    eraseNewReservationSuccess();
    navigate(Path.profile);
  };

  useEffect(() => {
    if (state.loggedUser) {
      setShowAuth(false);
    }
  }, [state.loggedUser]);

  const title = localStorage.getItem("title");
  const pageTitle = title ? title : "System rezerwacji on-line";

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.item2} md={1.5} xs={12} />
      <Grid item className={classes.main} md={9} xs={12}>
        <div onClick={goToHome}>
          <Typography variant="h5">{pageTitle}</Typography>
        </div>
      </Grid>
      <Grid item className={classes.item} md={1.5} xs={12}>
        {!state.loggedUser ? (
          <Button variant="contained" color="primary" onClick={onButtonClick}>
            <LoginIcon className={classes.paddingRight} />
            {showAuth ? "Ukryj" : "Zaloguj się"}
          </Button>
        ) : (
          <>
            <Typography>{`Cześć ${state.loggedUser.name}!`}</Typography>
          </>
        )}
      </Grid>
      {!!state.loggedUser && (
        <Container className={classes.paddingBottom}>
          <Grid container>
            <Grid item xs={12} sm={6} md={3}>
              <Button onClick={goToHome} fullWidth variant="text">
                <BookIcon className={classes.paddingRight} />
                Nowa rezerwacja
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button onClick={goToReservations} fullWidth variant="text">
                <ManageSearchIcon className={classes.paddingRight} />
                Zarządzaj i historia
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button onClick={goToProfile} fullWidth variant="text">
                <EditIcon className={classes.paddingRight} />
                Edytuj profil
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button onClick={signOut} fullWidth variant="text">
                <LogoutIcon className={classes.paddingRight} />
                Wyloguj
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}

      {!!showAuth && (
        <>
          <div className={classes.topBar} />
          <div className={classes.auth}>
            <Auth state={state} dispatch={dispatch} />
          </div>
        </>
      )}
    </Grid>
  );
};

export default Navbar;
