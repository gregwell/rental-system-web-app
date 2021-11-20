import { Formik } from "formik";
import { TextField, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  container: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    padding: "30px 30px",
    width: "300px",
    margin: "0 auto",
    textAlign: "center",
  },
  item: {
    textAlign: "center",
    padding: "10px 10px 10px 10px",
  },
});

const LoginPopup = () => {
  const classes = useStyles();

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className={classes.container}>
              <h1>Zaloguj się</h1>
              <div className={classes.item}>
                <div>Podaj adres e-mail</div>
                <div>
                  <TextField
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
              </div>
              <div>
                <div> Podaj hasło </div>
                <div>
                  <TextField
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
              </div>
              <div>
                {" "}
                {errors.password && touched.password && errors.password}
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
              {errors.email && touched.email && errors.email}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPopup;
