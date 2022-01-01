import {
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  Alert,
  AlertTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { CrudOperation, User, Collection } from "../general/types";
import SingleProfileItem from "./SingleProfileItem";
import { sendApiRequest } from "../async/sendApiRequest";
import { encrypt, encryptObject } from "../utils";
import AccessGuard from "../general/AccessGuard";

const useStyles = makeStyles({
  panel: {
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "80px",
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
  deleteButton: {
    height: "56px",
  },
});

interface MyProfileProps {
  loggedUser: User | null | undefined;
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  setLoggedUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}

const MyProfile = ({
  loggedUser,
  users,
  setUsers,
  setLoggedUser,
}: MyProfileProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    setName(loggedUser?.name as string);
    setSurname(loggedUser?.surname as string);
    setPhone(loggedUser?.phone as string);
    setEmail(loggedUser?.email as string);
  }, [loggedUser]);

  const [updateDataSuccesful, setUpdateDataSuccesful] = useState<
    boolean | null
  >(null);

  const [deleteUserSuccessful, setDeleteUserSuccessful] = useState<
    boolean | null
  >(null);

  const [showDeletePasswordConfirmation, setShowDeletePasswordConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    if (deleteUserSuccessful === true) {
      const timer = setTimeout(() => {
        setDeleteUserSuccessful(null);
        setLoggedUser(null);
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [deleteUserSuccessful, loggedUser, navigate, setLoggedUser]);

  const onDeleteUser = async () => {
    if (!loggedUser) {
      return;
    }

    await sendApiRequest({
      collection: Collection.users,
      operation: CrudOperation.DELETE,
      filter: { _id: { $oid: loggedUser._id } },
      setState: setDeleteUserSuccessful,
    });

    if (deleteUserSuccessful === false) {
      return;
    }

    if (users) {
      setUsers(
        users.filter((user) => {
          return !(user?._id === loggedUser._id);
        })
      );
    }
  };

  const onUpdate = () => {
    if (!loggedUser) {
      return;
    }

    const updated: any = {};
    let updatedLoggedUser = loggedUser;

    if (name !== loggedUser.name) {
      updated.name = encrypt(name);
      updatedLoggedUser.name = name;
    }

    if (surname !== loggedUser.surname) {
      updated.surname = encrypt(surname);
      updatedLoggedUser.surname = surname;
    }

    if (phone !== loggedUser.phone) {
      updated.phone = encrypt(phone);
      updatedLoggedUser.phone = phone;
    }

    if (email !== loggedUser.email) {
      updated.email = encrypt(email);
      updatedLoggedUser.email = email;
    }

    sendApiRequest({
      collection: Collection.users,
      operation: CrudOperation.UPDATE,
      filter: { _id: { $oid: loggedUser._id } },
      update: {
        $set: updated,
      },
      setState: setUpdateDataSuccesful,
    });

    if (updateDataSuccesful === false) {
      return;
    }

    setLoggedUser(updatedLoggedUser);

    if (!users) {
      setUsers([updated]);
      return;
    }

    const updatedUsers = users.reduce((acc, curr) => {
      const user =
        curr._id === loggedUser._id ? encryptObject(updatedLoggedUser) : curr;
      acc.push(user);
      return acc;
    }, [] as User[]);

    setUsers(updatedUsers);
  };
  return (
    <AccessGuard wait={loggedUser === undefined} deny={loggedUser === null}>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          {!!loggedUser && (
            <>
              <Typography variant="h5">Edycja profilu</Typography>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.center}>
                      <Typography variant="h6">Dane osobowe</Typography>
                    </Grid>
                    <SingleProfileItem
                      caption="Imię"
                      value={name}
                      setValue={setName}
                    />
                    <SingleProfileItem
                      caption="Nazwisko"
                      value={surname}
                      setValue={setSurname}
                    />
                    <SingleProfileItem
                      caption="Numer telefonu"
                      value={phone}
                      setValue={setPhone}
                    />
                    <SingleProfileItem
                      caption="Adres email"
                      value={email}
                      setValue={setEmail}
                    />

                    <Grid item xs={12}>
                      <Button variant="contained" fullWidth onClick={onUpdate}>
                        aktualizuj
                      </Button>
                    </Grid>
                    {updateDataSuccesful === true && (
                      <Grid item xs={12}>
                        <Alert severity="success">
                          <AlertTitle>Suckes!</AlertTitle>
                          Dane zostały zaktualizowane!
                        </Alert>
                      </Grid>
                    )}
                    {updateDataSuccesful === false && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          <AlertTitle>Wystąpił błąd!</AlertTitle>
                          Nie udało się zaktualizować danych. Sprawdź połączenie
                          z Internetem lub skontakuj się z pracownikiem
                          wypożyczalni.
                        </Alert>
                      </Grid>
                    )}
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
                    {!!showDeletePasswordConfirmation && (
                      <>
                        <Grid item xs={12} className={classes.center}>
                          <Typography color="error">
                            Tej akcji nie możesz cofnąć. Jesteś pewny/na?
                          </Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        className={classes.deleteButton}
                        variant={
                          showDeletePasswordConfirmation
                            ? "contained"
                            : "outlined"
                        }
                        color="error"
                        onClick={
                          showDeletePasswordConfirmation
                            ? onDeleteUser
                            : () => setShowDeletePasswordConfirmation(true)
                        }
                      >
                        Usuń konto
                      </Button>
                    </Grid>
                    {deleteUserSuccessful === false && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          <AlertTitle>Błąd!</AlertTitle>
                          Nie udało się usunąć konta. Skontaktuj się z
                          pracownikiem wypożyczalni lub sprawdź połączenie z
                          Internetem.
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {deleteUserSuccessful === true && (
            <Alert severity="success">
              Konto zostało usunięte. Zostaniesz przeniesiony do głównej strony.
            </Alert>
          )}
        </Container>
      </div>
    </AccessGuard>
  );
};

export default MyProfile;
