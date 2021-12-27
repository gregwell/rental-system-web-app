import { Typography, Container, Grid, Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  /*
  if (!loggedUser) {
    navigate("/");
    return null;
  }
*/

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
    });

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

    console.log(newUserEncrypted(loggedUser));

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
