import { useState, useCallback } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import GoogleIcon from "@mui/icons-material/Google";

import { User, CrudOperation, Collection } from "../general/types";
import { sendApiRequest } from "../async/sendApiRequest";
import {
  decrypt,
  encryptObject,
  decryptObject,
  formatCode,
  removeDashes,
} from "../utils";
import { alerts, alertTitles, buttonLabels, sectionLabels } from "./constants";

const useStyles = makeStyles({
  login: {
    textAlign: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  zalogujButton: {
    paddingTop: "20px",
  },
  paddingRight: {
    paddingRight: "7px",
  },
  codeLogin: {
    paddingTop: "27px",
  },
  left: {
    textAlign: "left",
  },
});

interface AuthProps {
  users: User[] | null;
  setLoggedUser: (value: User | null | undefined) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const Auth = ({ users, setLoggedUser, setUsers }: AuthProps) => {
  const classes = useStyles();

  const [showGoogleRegisterForm, setShowGoogleRegisterForm] =
    useState<boolean>(false);
  const [showCodeRegisterForm, setShowCodeRegisterForm] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordSecond, setPasswordSecond] = useState<string>("");
  const [showPasswordAlert, setShowPasswordAlert] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [wrongLoginPassword, setWrongLoginPassword] = useState<boolean>(false);
  const [wrongLoginEmail, setWrongLoginEmail] = useState<boolean>(false);

  const [noSuchCode, setNoSuchCode] = useState<boolean>(false);
  const [updateDataSuccesful, setUpdateDataSuccesful] = useState<
    boolean | null
  >(null);

  const [googleId, setGoogleId] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState<string>("");

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
      idCard: "",
    };

    const encryptedPostBody = encryptObject(postBody);

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

    const decryptedUserFound: User = decryptObject(userFound);

    if (decryptedUserFound.password !== loginPassword) {
      setWrongLoginPassword(true);
      return;
    }

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
      idCard: "",
    };

    const encryptedPostBody: User = encryptObject(postBody);

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

    if (userFound) {
      const decryptedUserFound: User = decryptObject(userFound);

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

  const handleCodeRegisterCheck = useCallback(() => {
    if (removeDashes(codeInput).length !== 24) {
      setNoSuchCode(true);
      return;
    }
    setNoSuchCode(false);

    const userFound: User | undefined = users?.find((user) => {
      return user?._id === removeDashes(codeInput);
    });

    if (!userFound || userFound?.password !== "") {
      setNoSuchCode(true);
      return;
    }

    setEmail(userFound?.email);
    setName(userFound?.name);
    setSurname(userFound?.surname);
    setPhone(userFound?.phone);
    setPassword("");
    setPasswordSecond("");
    setIdCard(userFound?.idCard as string);
    setShowCodeRegisterForm(true);
  }, [codeInput, users]);

  const handleCodeRegister = async () => {
    if (!codeInput) {
      return;
    }

    const postBody: User = {
      name: name,
      surname: surname,
      email: email,
      googleId: "",
      phone: phone,
      password: password,
      idCard: idCard,
    };

    const updated: User = encryptObject(postBody);

    sendApiRequest({
      collection: Collection.users,
      operation: CrudOperation.UPDATE,
      filter: { _id: { $oid: removeDashes(codeInput) } },
      update: {
        $set: updated,
      },
      setState: setUpdateDataSuccesful,
    });

    if (updateDataSuccesful === false) {
      return;
    }

    setLoggedUser(postBody);

    if (!users) {
      setUsers([updated]);
      return;
    }

    const updatedUsers = users.reduce((acc, curr) => {
      const user = curr._id === removeDashes(codeInput) ? updated : curr;
      acc.push(user);
      return acc;
    }, [] as User[]);

    setUsers(updatedUsers);
  };

  return (
    <>
      <div className={classes.login}>
        {!showGoogleRegisterForm && !showCodeRegisterForm && (
          <>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID as string}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  variant="contained"
                >
                  <GoogleIcon className={classes.paddingRight} />
                  {buttonLabels.proceedWithGoogle}
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
                      {sectionLabels.register}
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
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="info">
                        <AlertTitle>{alertTitles.registerFailed}</AlertTitle>
                        {alerts.differentPasswords}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleRegister}
                    >
                      {buttonLabels.register}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6">{sectionLabels.login}</Typography>
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
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="info">
                        <AlertTitle>{alertTitles.loginFailed}</AlertTitle>
                        {wrongLoginPassword
                          ? alerts.wrongPassword
                          : alerts.wrongEmail}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button variant="contained" fullWidth onClick={handleLogin}>
                      {buttonLabels.login}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.codeLogin} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6">
                      {sectionLabels.registerWithCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="24-cyfrowy unikalny kod z wypożyczalni"
                      variant="outlined"
                      fullWidth
                      value={codeInput}
                      onChange={(event) => {
                        setNoSuchCode(false);
                        setCodeInput(formatCode(event.target.value));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCodeRegisterCheck}
                    >
                      {buttonLabels.registerWithCode}
                    </Button>
                  </Grid>
                  {!!noSuchCode && (
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="info">
                        <AlertTitle>
                          {removeDashes(codeInput).length !== 24
                            ? alertTitles.codeTooShort
                            : alertTitles.noSuchCode}
                        </AlertTitle>
                        {removeDashes(codeInput).length !== 24
                          ? alerts.codeTooShort
                          : alerts.noSuchCode}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {!!showGoogleRegisterForm && (
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography>{sectionLabels.firstGoogleLogin}</Typography>
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
                  onClick={handleGoogleRegister}
                >
                  {buttonLabels.register}
                </Button>
              </Grid>
            </Grid>
          </Container>
        )}
        {!!showCodeRegisterForm && (
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography>
                  {`Hej ${name} ${surname} ! Utwórz hasło do konta aby kontynuować!`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Adres email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  onChange={(event) => setPasswordSecond(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCodeRegister}
                >
                  {buttonLabels.registerWithCode}
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