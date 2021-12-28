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
import { encrypt } from "../utils";

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
  deleteButton: {
    paddingTop: "19px",
    width: "100%",
  },
});

interface MyProfileProps {
  loggedUser: User | null;
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const MyProfile = ({
  loggedUser,
  users,
  setUsers,
  setLoggedUser,
}: MyProfileProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  console.log("NEW RERENDER ..");
  console.log(loggedUser);
  console.log(users);
  console.log(setUsers);
  console.log(setLoggedUser);
  console.log("^^ NEW RERENDER");

  const [name, setName] = useState<string>(
    loggedUser !== null ? loggedUser.name : ""
  );
  const [surname, setSurname] = useState<string>(
    loggedUser !== null ? loggedUser.surname : ""
  );
  const [phone, setPhone] = useState<string>(
    loggedUser !== null ? loggedUser.phone : ""
  );
  const [email, setEmail] = useState<string>(
    loggedUser !== null ? loggedUser.email : ""
  );

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
      console.log("THERE ARE USERS!");
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
    if (name !== loggedUser.name) {
      updated.name = encrypt(name);
    }
    if (surname !== loggedUser.surname) {
      updated.surname = encrypt(surname);
    }
    if (phone !== loggedUser.phone) {
      updated.phone = encrypt(phone);
    }
    if (email !== loggedUser.email) {
      updated.email = encrypt(email);
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

    console.log(updateDataSuccesful);

    if (updateDataSuccesful === false) {
      return;
    }

    const newUser = (prevState: User | null): User => {
      return {
        ...prevState,
        name: name,
        surname: surname,
        phone: phone,
        email: email,
      };
    };

    const newUserEncrypted = (prevState: User | null): User => {
      return {
        ...prevState,
        name: encrypt(name),
        surname: encrypt(surname),
        phone: encrypt(phone),
        email: encrypt(email),
        googleId: encrypt(loggedUser?.googleId),
        password: encrypt(loggedUser?.password),
      };
    };

    if (users) {
      setUsers(
        users.filter((user) => {
          return !(user?._id === loggedUser._id);
        })
      );
      setUsers((prevState) => {
        return prevState !== null
          ? [...prevState, newUserEncrypted(loggedUser)]
          : [newUserEncrypted(loggedUser)];
      });

      setLoggedUser((prevState) => newUser(prevState));
    }
  };
  return (
    <>
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
                          Nie udało się zaktualizować danych. Sprawdź połączenie z Internetem lub skontakuj się z pracownikiem wypożyczalni.
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
                          <Typography color="error">Jesteś pewien?</Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
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
                          pracownikiem wypożyczalni lub sprawdź połączenie z Internetem.
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
    </>
  );
};

export default MyProfile;
