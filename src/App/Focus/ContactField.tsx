import { Alert, AlertTitle, Grid, TextField, Button } from "@mui/material";
import emailjs from "@emailjs/browser";
import {
  CompanyInfo,
  Reservation,
  Rental,
  Item,
  User,
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
  companyInfo?: CompanyInfo;
  startDateFormatted: string;
  finishDateFormatted: string;
  reservation?: Reservation | Rental | null;
  item?: Item | null;
  loggedUser?: User | null;
}

const ContactField = ({
  companyInfo,
  startDateFormatted,
  finishDateFormatted,
  reservation,
  item,
  loggedUser,
}: ContactFieldProps) => {
  const [query, setQuery] = useState<string>("");
  const [querySuccess, setQuerySuccess] = useState<boolean | null>(null);
  const classes = useStyles();

  if (!reservation || !loggedUser || !reservation || !companyInfo) {
    return null;
  }

  const handleEmailSend = async () => {
    if (!companyInfo) {
      return;
    }

    try {
      await emailjs.send("service_s5znq5v", "clientQuery", {
        startDate: startDateFormatted,
        queryText: query,
        reservationId: reservation?._id,
        itemFullName: `${item?.producer} ${item?.model} (rozmiar: ${item?.size})`,
        finishDate: finishDateFormatted,
        clientFullName: `${loggedUser?.name} ${loggedUser?.surname}`,
        clientId: reservation?.userId,
        companyEmail: companyInfo?.email,
        clientEmail: loggedUser?.email,
      });
      console.log("success");
      setQuerySuccess(true);
    } catch (error) {
      console.log("failed");
      setQuerySuccess(false);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Alert severity="info">
          <AlertTitle>
            Na tej stronie możesz wysłać zapytanie e-mail dotyczące tej
            rezerwacji.
          </AlertTitle>
          {`Pamiętaj, że w nagłych przypadkach możesz skontaktować się z nami pod numerem telefonu ${companyInfo?.phone}`}
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
              {`Skontakuj się z wypożyczalnią pod numerem telefonu ${companyInfo?.phone} aby uzyskać informacje.`}
            </Alert>
          )}
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              multiline
              rows={4}
              placeholder="Tutaj wpisz treść swojego zapytania do tej rezerwacji..."
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
      P
    </>
  );
};

export default ContactField;
