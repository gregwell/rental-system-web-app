import { Alert, AlertTitle, Grid, TextField, Button } from "@mui/material";
import emailjs from "@emailjs/browser";
import {
  Reservation,
  Rental,
  Item,
  State,
} from "../constants/types";
import { useState } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    marginLeft: "10px",
  },
});

interface ContactFieldProps {
  startDateFormatted: string;
  finishDateFormatted: string;
  service?: Reservation | Rental | null;
  item?: Item | null;
  rental?: boolean;
  state: State;
}

const ContactField = ({
  state,
  startDateFormatted,
  finishDateFormatted,
  service,
  item,
  rental,
}: ContactFieldProps) => {
  const [query, setQuery] = useState<string>("");
  const [querySuccess, setQuerySuccess] = useState<boolean | null>(null);
  const classes = useStyles();

  if (!service || !state.loggedUser || !service || !state.companyInfo) {
    return null;
  }

  const handleEmailSend = async () => {
    if (!state.companyInfo) {
      return;
    }

    try {
      await emailjs.send("service_s5znq5v", "clientQuery", {
        startDate: startDateFormatted,
        queryText: query,
        serviceId: service?._id,
        itemFullName: `${item?.producer} ${item?.model} (rozmiar: ${item?.size})`,
        finishDate: finishDateFormatted,
        clientFullName: `${state.loggedUser?.name} ${state.loggedUser?.surname}`,
        clientId: service?.userId,
        companyEmail: state.companyInfo?.email,
        clientEmail: state.loggedUser?.email,
      });
      console.log("success");
      setQuerySuccess(true);
    } catch (error) {
      console.log("failed");
      setQuerySuccess(false);
    }
  };

  const alertText = rental ? " tego wypożyczenia" : "tej rezerwacji";

  return (
    <>
      <Grid item xs={12}>
        <Alert severity="info">
          <AlertTitle>
            {`Na tej stronie możesz wysłać zapytanie e-mail dotyczące ${alertText}.`}
          </AlertTitle>
          {`Pamiętaj, że w nagłych przypadkach możesz skontaktować się z nami pod numerem telefonu ${state.companyInfo?.phone}`}
        </Alert>
      </Grid>
      {querySuccess !== null ? (
        <Grid item xs={12}>
          {querySuccess === true ? (
            <Alert severity="success">
              <AlertTitle>Zapytanie zostało wysłane.</AlertTitle>Odpowiedź
              dostaniesz na email zarejestrowany w serwisie.
            </Alert>
          ) : (
            <Alert severity="error">
              <AlertTitle>Wystąpił błąd!</AlertTitle>
              {`Skontakuj się z wypożyczalnią pod numerem telefonu ${state.companyInfo?.phone} aby uzyskać informacje.`}
            </Alert>
          )}
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              multiline
              rows={4}
              placeholder="Tutaj wpisz treść swojego zapytania..."
              variant="standard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleEmailSend}
            >
              Wyślij zapytanie
            </Button>
          </Grid>
        </>
      )}
    </>
  );
};

export default ContactField;
