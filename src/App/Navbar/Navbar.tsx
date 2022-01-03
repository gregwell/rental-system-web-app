import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BookIcon from "@mui/icons-material/Book";
import LoginIcon from "@mui/icons-material/Login";

import Auth from "../Auth/Auth";
import { User } from "../general/types";
import { useStyles } from "./styles";

interface NavbarProps {
  users: User[] | null;
  loggedUser: User | null | undefined;
  setLoggedUser: (value: User | null | undefined) => void;
  setNewReservationSuccess: (newVal: boolean | null) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const Navbar = ({
  users,
  loggedUser,
  setLoggedUser,
  setNewReservationSuccess,
  setUsers,
}: NavbarProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState<boolean>(false);

  const onButtonClick = () => {
    setShowAuth(!showAuth);
  };

  const signOut = () => {
    setLoggedUser(null);
    localStorage.setItem("user", "");
    navigate("/");
  };

  const goToReservations = () => {
    setNewReservationSuccess(null);
    navigate("/reservations");
  };

  const goToHome = () => {
    setNewReservationSuccess(null);
    navigate("/");
  };

  const goToProfile = () => {
    setNewReservationSuccess(null);
    navigate("/profile");
  };

  useEffect(() => {
    if (loggedUser) {
      setShowAuth(false);
    }
  }, [loggedUser]);

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
        {!loggedUser ? (
          <Button variant="contained" color="primary" onClick={onButtonClick}>
            <LoginIcon className={classes.paddingRight} />
            {showAuth ? "Ukryj" : "Zaloguj się"}
          </Button>
        ) : (
          <>
            <Typography>{`Cześć ${loggedUser.name}!`}</Typography>
          </>
        )}
      </Grid>
      {!!loggedUser && (
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
            <Auth
              users={users}
              setLoggedUser={setLoggedUser}
              setUsers={setUsers}
            />
          </div>
        </>
      )}
    </Grid>
  );
};

export default Navbar;
