import { Grid, TextField, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { UserPostBody, User } from "./ReservationPanel/types";
import { usePostData } from "./ReservationPanel/usePostData";
import { useState, useCallback } from "react";

import { GoogleLogin } from "react-google-login";

const useStyles = makeStyles({
  login: {
    textAlign: "center",
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

  //to do: create a new account when google first time login
  //to do: type for google repsonse

  const [googleUserData, setGoogleUserData] = useState<User | null>(null);

  const { postData } = usePostData();

  const handleRegister = useCallback(() => {
    if (password !== passwordSecond) {
      setShowPasswordAlert(true);
      return;
    }
    const postBody: UserPostBody = {
      name: name,
      surname: surname,
      email: email,
      googleId: "",
      phone: phone,
      password: password,
    };
    postData("users", postBody);
  }, [email, name, password, passwordSecond, postData, surname, phone]);

  const handleGoogleRegister = useCallback(() => {
    if (googleUserData) {
      const postBody: UserPostBody = {
        name: name,
        surname: surname,
        email: googleUserData?.email,
        googleId: googleUserData?.googleId,
        phone: phone,
        password: "",
      };
      postData("users", postBody);
      setLoggedUser(postBody);
    }
  }, [googleUserData, name, surname, phone, postData, setLoggedUser]);

  const googleSuccess = async (res: any) => {
    console.log(res.googleId);
    console.log(res.profileObj);
    console.log(users);
    const userFound: User | undefined = users?.find(
      (user) => user?.googleId === res.googleId
    );
    if (userFound) {
      console.log("dd");
      console.log(userFound);
      //set current user
      setLoggedUser(userFound);
      return;
    }

    if (!userFound) {
      console.log("we have to create a new user");
      setGoogleUserData(res.profileObj);
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
                  Kontynuuj z użyciem konta Google
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
                      <Typography>Hasła są różne!</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleRegister}
                    >
                      Kontynuuj
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
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {!!showGoogleRegisterForm && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography>
                Wygląda na to, że to Twoje pierwsze logowanie przy pomocy
                Google. Uzupełnij poniższe dane by kontynuować!
              </Typography>
              <Typography>
                {`Twój adres email to ${googleUserData?.email}`}
              </Typography>
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
                onClick={googleUserData ? handleGoogleRegister : handleRegister}
              >
                Kontynuuj
              </Button>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
};

export default Auth;
