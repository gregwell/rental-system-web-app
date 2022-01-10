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

import {
  User,
  CrudOperation,
  Collection,
  AuthFormFields,
  Path,
} from "../constants/types";
import { sendApiRequest } from "../async/sendApiRequest";
import {
  decrypt,
  encryptObject,
  decryptObject,
  formatCode,
  removeDashes,
  encryptLong,
} from "../utils";
import { alerts, alertTitles, buttonLabels, sectionLabels } from "./constants";
import FormField from "./FormField";
import emailjs from "@emailjs/browser";

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

  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [randomEmailCode, setRandomEmailCode] = useState<string>("");

  const [user, setUser] = useState<AuthFormFields>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    idCard: "",
    password: "",
    passwordSecond: "",
    loginEmail: "",
    loginPassword: "",
    emailCode: "",
  });
  const [showPasswordAlert, setShowPasswordAlert] = useState<boolean>(false);

  const [wrongLoginPassword, setWrongLoginPassword] = useState<boolean>(false);
  const [wrongLoginEmail, setWrongLoginEmail] = useState<boolean>(false);

  const [emailCodeAlert, setEmailCodeAlert] = useState<boolean | null>(null);

  const [noSuchCode, setNoSuchCode] = useState<boolean>(false);
  const [updateDataSuccesful, setUpdateDataSuccesful] = useState<
    boolean | null
  >(null);

  const [googleId, setGoogleId] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState<string>("");

  const handleRegister = useCallback(async () => {
    if (user.password !== user.passwordSecond) {
      setShowPasswordAlert(true);
      return;
    }

    if (user.emailCode !== randomEmailCode) {
      setEmailCodeAlert(true);
      return;
    }

    const postBody: User = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      googleId: "",
      phone: user.phone,
      password: user.password,
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
    user.password,
    user.passwordSecond,
    user.emailCode,
    user.name,
    user.surname,
    user.email,
    user.phone,
    randomEmailCode,
    users,
    setLoggedUser,
  ]);

  const handleLogin = useCallback(() => {
    const userFound: User | undefined = users?.find((currUser) => {
      return (
        currUser?.email.length > 0 &&
        decrypt(currUser?.email) === user.loginEmail
      );
    });

    if (!userFound) {
      setWrongLoginEmail(true);
      return;
    }

    const decryptedUserFound: User = decryptObject(userFound);

    if (decryptedUserFound.password !== user.loginPassword) {
      setWrongLoginPassword(true);
      return;
    }

    decryptedUserFound._id = userFound._id;
    setLoggedUser(decryptedUserFound);
    return;
  }, [users, user.loginPassword, user.loginEmail, setLoggedUser]);

  const handleGoogleRegister = async () => {
    if (!googleId) {
      return;
    }

    const postBody: User = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      googleId: googleId,
      phone: user.phone,
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

    const googleId: string = res?.googleId ? res.googleId.slice(0, 14) : "";

    const userFound: User | undefined = users?.find((user) => {
      return (
        user?.googleId &&
        user?.googleId.length > 0 &&
        decrypt(user?.googleId) === googleId
      );
    });

    if (userFound) {
      const decryptedUserFound: User = decryptObject(userFound);

      setLoggedUser(decryptedUserFound);
      return;
    }

    if (!userFound) {
      setGoogleId(googleId);

      const updatedUser = user;
      updatedUser.email = res.profileObj?.email;
      updatedUser.name = res.profileObj?.givenName;
      updatedUser.surname = res.profileObj?.familyName;
      setUser(updatedUser);

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

    const updatedUser = user;
    updatedUser.email = userFound?.email;
    updatedUser.name = userFound?.name;
    updatedUser.surname = userFound?.surname;
    updatedUser.phone = userFound?.phone;

    setUser(userFound);
    setShowCodeRegisterForm(true);
    
  }, [codeInput, user, users]);

  const handleCodeRegister = async () => {
    if (!codeInput) {
      return;
    }

    const postBody: User = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      googleId: "",
      phone: user.phone,
      password: user.password,
      idCard: user.idCard,
    };

    console.log(postBody);

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

  const onSendEmail = async () => {
    setEmailCodeAlert(null);
    try {
      const code = [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

      setRandomEmailCode(code);

      const link = `http://localhost:3000${Path.confirmEmail}/${encryptLong(
        JSON.stringify(
          encryptObject({
            name: user.name,
            surname: user.surname,
            email: user.email,
            googleId: "",
            phone: user.phone,
            password: user.password,
            idCard: "",
          })
        )
      ).replace(/\//g, "temporarySolution")}`;
      console.log(link);
      /*
      await emailjs.send("service_s5znq5v", "confirmEmail", {
        code: code,
        enteredEmail: user.email,
        link: link,
      });
*/
      setEmailSent(true);
    } catch (error) {
      console.log("could not send email");
      setEmailCodeAlert(false);
    }
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
                  <FormField
                    field="name"
                    setUser={setUser}
                    user={user}
                    narrow
                  />
                  <FormField
                    field="surname"
                    setUser={setUser}
                    user={user}
                    narrow
                  />
                  <FormField field="email" setUser={setUser} user={user} />
                  <FormField field="phone" setUser={setUser} user={user} />
                  <FormField field="password" setUser={setUser} user={user} />
                  <FormField
                    field="passwordSecond"
                    setUser={setUser}
                    user={user}
                  />

                  {!!showPasswordAlert && (
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="info">
                        <AlertTitle>{alertTitles.registerFailed}</AlertTitle>
                        {alerts.differentPasswords}
                      </Alert>
                    </Grid>
                  )}
                  {!!emailSent && (
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="warning">
                        <AlertTitle>{alertTitles.emailSent}</AlertTitle>
                        {alerts.emailSent}{" "}
                        <FormField
                          field="emailCode"
                          setUser={setUser}
                          user={user}
                        />
                      </Alert>
                    </Grid>
                  )}
                  {emailCodeAlert !== null && (
                    <Grid item xs={12} sm={12} md={12} className={classes.left}>
                      <Alert severity="error">
                        <AlertTitle>
                          {emailCodeAlert === true
                            ? alertTitles.wrongCode
                            : alertTitles.emailServerError}
                        </AlertTitle>
                        {emailCodeAlert === true
                          ? alerts.wrongCode
                          : alerts.emailServerError}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={emailCodeAlert ? true : false}
                      onClick={emailSent ? handleRegister : onSendEmail}
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
                  <FormField field="loginEmail" setUser={setUser} user={user} />
                  <FormField
                    field="loginPassword"
                    setUser={setUser}
                    user={user}
                  />
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
              <FormField field="email" disabled setUser={setUser} user={user} />
              <FormField field="name" setUser={setUser} user={user} />
              <FormField field="surname" setUser={setUser} user={user} />
              <FormField field="phone" setUser={setUser} user={user} />
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
                  {`Hej ${user.name} ${user.surname} ! Utwórz hasło do konta aby kontynuować!`}
                </Typography>
              </Grid>
              <FormField field="email" setUser={setUser} user={user} />
              <FormField field="password" setUser={setUser} user={user} />
              <FormField field="passwordSecond" setUser={setUser} user={user} />
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
