import { useState, useCallback } from "react";
import { Grid, TextField, Button, Typography, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import GoogleIcon from "@mui/icons-material/Google";

import { User, CrudOperation, Collection } from "./general/types";
import { sendApiRequest } from "./async/sendApiRequest";
import { encrypt, decrypt } from "./utils";

const useStyles = makeStyles({
  login: {
    textAlign: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  zalogujButton: {
    paddingTop: "20px",
  },
});

interface AuthProps {
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
}

const Auth = ({ users, loggedUser, setLoggedUser }: AuthProps) => {
  const classes = useStyles();

  const [showGoogleRegisterForm, setShowGoogleRegisterForm] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordSecond, setPasswordSecond] = useState<string>("");
  const [showPasswordAlert, setShowPasswordAlert] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [wrongLoginPassword, setWrongLoginPassword] = useState<boolean>(false);
  const [wrongLoginEmail, setWrongLoginEmail] = useState<boolean>(false);

  const [googleId, setGoogleId] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (password !== passwordSecond) {
      setShowPasswordAlert(true);
      return;
    }

    const postBody: User = {
      name: name,
      surname: surname,
      email: email,
      googleId: "",
      phone: phone,
      password: password,
    };

    const encryptedPostBody: User = {
      name: encrypt(name),
      surname: encrypt(surname),
      email: encrypt(email),
      googleId: "",
      phone: encrypt(phone),
      password: encrypt(password),
    };

    const insertedId: string = (await sendApiRequest({
      collection: Collection.users,
      operation: CrudOperation.CREATE,
      body: encryptedPostBody,
    })) as string;

    if (users) {
      encryptedPostBody._id = insertedId;
      users.push(encryptedPostBody);
    }

    postBody._id = insertedId;
    setLoggedUser(postBody);
  }, [
    password,
    passwordSecond,
    name,
    surname,
    email,
    phone,
    users,
    setLoggedUser,
  ]);

  const handleLogin = useCallback(() => {
    const userFound: User | undefined = users?.find((user) => {
      return user?.email.length > 0 && decrypt(user?.email) === loginEmail;
    });

    if (!userFound) {
      setWrongLoginEmail(true);
      return;
    }

    if (decrypt(userFound?.password as string) !== loginPassword) {
      setWrongLoginPassword(true);
      return;
    }

    const decryptedUserFound: User = {
      name: decrypt(userFound.name),
      surname: decrypt(userFound.surname),
      email: decrypt(userFound.email),
      googleId:
        userFound?.googleId && userFound?.googleId.length > 0
          ? decrypt(userFound.googleId)
          : "",
      phone: decrypt(userFound.phone),
      password: decrypt(userFound.password),
    };

    decryptedUserFound._id = userFound._id;
    setLoggedUser(decryptedUserFound);
    return;
  }, [loginEmail, loginPassword, setLoggedUser, users]);

  const handleGoogleRegister = async () => {
    if (!googleId) {
      return;
    }

    const postBody: User = {
      name: name,
      surname: surname,
      email: email,
      googleId: googleId,
      phone: phone,
      password: "",
    };

    const encryptedPostBody: User = {
      name: encrypt(name),
      surname: encrypt(surname),
      email: encrypt(email),
      googleId: encrypt(googleId),
      phone: encrypt(phone),
      password: "",
    };

    const insertedId: string = (await sendApiRequest({
      collection: Collection.users,
      operation: CrudOperation.CREATE,
      body: encryptedPostBody,
    })) as string;

    encryptedPostBody._id = insertedId;
    if (users) {
      users.push(encryptedPostBody);
    }

    postBody._id = insertedId;
    setLoggedUser(postBody);
  };

  const googleSuccess = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    function isGoogleId(
      res: GoogleLoginResponse | GoogleLoginResponseOffline
    ): res is GoogleLoginResponse {
      return "googleId" in res;
    }

    if (!isGoogleId(res)) {
      return;
    }

    const userFound: User | undefined = users?.find((user) => {
      return (
        user?.googleId &&
        user?.googleId.length > 0 &&
        decrypt(user?.googleId) === res?.googleId
      );
    });

    console.log(users);
    console.log(userFound);

    if (userFound) {
      const decryptedUserFound: User = {
        _id: userFound._id,
        name: decrypt(userFound.name),
        surname: decrypt(userFound.surname as string),
        email: decrypt(userFound.email),
        googleId: decrypt(userFound.googleId as string),
        phone: decrypt(userFound.phone as string),
        password: "",
      };

      setLoggedUser(decryptedUserFound);
      return;
    }

    if (!userFound) {
      setGoogleId(res.googleId);
      setEmail(res.profileObj?.email);
      setName(res.profileObj?.givenName);
      setSurname(res.profileObj?.familyName);
      setShowGoogleRegisterForm(true);
    }
  };

  const googleFailure = (res: any) => {
    console.log(res);
  };

  return (
    <>
      <div className={classes.login}>
        {!showGoogleRegisterForm && (
          <>
            <GoogleLogin
              clientId="700980121685-uvjv9maee07tcoek4b16p1mr6v10b65q.apps.googleusercontent.com"
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  variant="contained"
                >
                  <GoogleIcon />
                  {` Kontynuuj z użyciem konta Google`}
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy="single_host_origin"
            />
            <br />
            <br />
            <Grid container spacing={5}>
              <Grid item xs={12} sm={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6">
                      Uzupełnij dane aby utworzyć nowe konto
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      label="Imię"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      label="Nazwisko"
                      variant="outlined"
                      fullWidth
                      value={surname}
                      onChange={(event) => setSurname(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Adres e-mail"
                      variant="outlined"
                      fullWidth
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Numer telefonu"
                      variant="outlined"
                      fullWidth
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Powtórz hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={passwordSecond}
                      onChange={(event) =>
                        setPasswordSecond(event.target.value)
                      }
                    />
                  </Grid>
                  {!!showPasswordAlert && (
                    <Grid item xs={12} sm={12} md={12}>
                      <Typography color="error">Hasła są różne!</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleRegister}
                    >
                      Zarejestruj
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6">Masz już konto?</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Hasło"
                      variant="outlined"
                      fullWidth
                      type="password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                  </Grid>
                  {(wrongLoginPassword || wrongLoginEmail) && (
                    <Grid item xs={12} sm={12} md={12}>
                      <Typography color="error">
                        {wrongLoginPassword
                          ? "Złe hasło"
                          : "Ten email nie został jeszcze zarejrestrowany"}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button variant="contained" fullWidth onClick={handleLogin}>
                      Zaloguj
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {!!showGoogleRegisterForm && (
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography>
                  Wygląda na to, że to Twoje pierwsze logowanie przy pomocy
                  Google. Uzupełnij poniższe dane by kontynuować!
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Adres email"
                  variant="outlined"
                  disabled
                  fullWidth
                  value={email}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Imię"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Nazwisko"
                  variant="outlined"
                  fullWidth
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Numer telefonu"
                  variant="outlined"
                  fullWidth
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={googleId ? handleGoogleRegister : handleRegister}
                >
                  Utwórz konto
                </Button>
              </Grid>
            </Grid>
          </Container>
        )}
      </div>
    </>
  );
};

export default Auth;
