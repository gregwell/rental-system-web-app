import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  Container,
  LinearProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BookIcon from "@mui/icons-material/Book";
import LoginIcon from "@mui/icons-material/Login";

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
  },
  item2: {
    width: "100%",
    height: "0",
  },
  main: {
    paddingTop: "15px",
    paddingBottom: "15px",
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
  margin: {
    padding: "20px 0",
  },
  paddingBottom: {
    paddingBottom: "10px",
  },
  paddingRight: {
    paddingRight: "7px",
  },
});

interface NavbarProps {
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
  setNewReservationSuccess: (newVal: boolean | null) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  usersInitialized: boolean;
}

const Navbar = ({
  users,
  loggedUser,
  setLoggedUser,
  setNewReservationSuccess,
  setUsers,
  usersInitialized,
}: NavbarProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState<boolean>(false);

  const onButtonClick = () => {
    setShowAuth(!showAuth);
  };

  const signOut = () => {
    setLoggedUser(null);
    localStorage.setItem("_id", "");
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

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.item2} md={1.5} xs={12} />
      <Grid item className={classes.main} md={9} xs={12}>
        <div onClick={goToHome}>
          <Typography variant="h5">System rezerwacji on-line</Typography>
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
      {!usersInitialized && !loggedUser && (
        <Container className={classes.paddingBottom}>
          <LinearProgress />
        </Container>
      )}

      {!!showAuth && (
        <>
          <div className={classes.topBar} />
          <div className={classes.auth}>
            <Auth
              users={users}
              loggedUser={loggedUser}
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
