import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Typography, Button, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";

import {
  Item,
  Reservation,
  User,
  Status,
  ItemPrice,
  CrudOperation,
  Collection,
  Path,
} from "../constants/types";
import { sendApiRequest } from "../async/sendApiRequest";
import Auth from "../Auth/Auth";
import CustomIcon from "../general/CustomIcon";
import emailjs from "@emailjs/browser";
import { formatDate } from "../utils";
import { getPolishName } from "./utils";
import CustomContainer from "../general/CustomContainer";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  title: {
    textAlign: "left",
  },
  button: {
    height: "55px",
    width: "100%",
  },
  customIcon: {
    transform: "scale(2.5)",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  color: {
    paddingBottom: "20px",
  },
  goBack: {
    paddingTop: "25px",
  },
});

interface ReservationConfirmationProps {
  choosenItem: Item;
  startDate: Date | null;
  finishDate: Date | null;
  isUserLogged: boolean;
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  loggedUser: User | null | undefined;
  setLoggedUser: (value: User | null | undefined) => void;
  pricesTable: ItemPrice[] | null;
  setIsShowingReservationForm: (value: boolean) => void;
  setNewReservationSuccess: (newValue: boolean | null) => void;
  newReservationSuccess: boolean | null;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

export const ReservationConfirmation = ({
  choosenItem,
  startDate,
  finishDate,
  users,
  setUsers,
  loggedUser,
  setLoggedUser,
  setIsShowingReservationForm,
  pricesTable,
  setNewReservationSuccess,
  newReservationSuccess,
  setReservations,
}: ReservationConfirmationProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const itemPrice = pricesTable?.find(
    (priceItem) => priceItem.type === choosenItem.type
  );

  const [currentReservation, setCurrentReservation] = useState<Reservation>();

  useEffect(() => {
    if (newReservationSuccess === true) {
      navigate(Path.services);

      /*
      emailjs.send("service_s5znq5v", "template_wwn9abw", {
        id: currentReservation?._id,
        displayName: `${loggedUser?.name} ${loggedUser?.surname}`,
        startDate: formatDate(startDate?.getTime().toString()),
        finishDate: formatDate(finishDate?.getTime().toString()),
        item: `${choosenItem.producer} ${choosenItem.model} (rozmiar: ${choosenItem.size})`,
      });
      */

      setReservations((prevState) => {
        const arr = [...prevState, currentReservation] as Reservation[];
        return arr;
      });
    }
  }, [
    choosenItem.model,
    choosenItem.producer,
    choosenItem.size,
    currentReservation,
    finishDate,
    loggedUser?.name,
    loggedUser?.surname,
    navigate,
    newReservationSuccess,
    setReservations,
    startDate,
  ]);

  const onSendReservation = useCallback(async () => {
    if (choosenItem && startDate && finishDate && loggedUser) {
      const reservationPostData: Reservation = {
        productId: choosenItem.productId,
        userId: loggedUser._id as string,
        startDate: startDate.getTime().toString(),
        finishDate: finishDate.getTime().toString(),
        price: itemPrice?.price.toString() as string,
        status: Status.confirmed,
      };

      setCurrentReservation(reservationPostData);
      const insertedId = (await sendApiRequest({
        collection: Collection.reservations,
        operation: CrudOperation.CREATE,
        body: reservationPostData,
        setState: setNewReservationSuccess,
      })) as string;

      reservationPostData._id = insertedId;
      setCurrentReservation(reservationPostData);
    }
  }, [
    choosenItem,
    finishDate,
    itemPrice?.price,
    loggedUser,
    setNewReservationSuccess,
    startDate,
  ]);

  if (!startDate || !finishDate) {
    return null;
  }

  return (
    <>
      <CustomContainer noPaddingBottom>
        {newReservationSuccess === false ? (
          <div className={classes.title}>
            <Alert severity="error">
              <AlertTitle>Błąd!</AlertTitle>
              Niestety nie udało się dokonać rezerwacji. Skontakuj się z
              pracownikiem wypożyczalni lub wybierz inny produkt / termin.
            </Alert>
          </div>
        ) : (
          <>
            <div className={classes.color}>
              <Typography variant="h6">Potwierdzenie rezerwacji</Typography>
              <div className={classes.customIcon}>
                <CustomIcon type={choosenItem.type} />
              </div>
              <Typography>{`${getPolishName(choosenItem.type)}`}</Typography>

              <Typography variant="h3">
                {`${choosenItem.producer} ${choosenItem.model}`}
              </Typography>

              <Typography>{`rozmiar: ${choosenItem.size}`}</Typography>

              <Typography>{`Odbiór: ${formatDate(
                startDate.getTime()
              )}`}</Typography>
              <Typography>{`Koniec: ${formatDate(
                finishDate.getTime()
              )}`}</Typography>

              <Typography variant="h5">
                {`${itemPrice?.price} zł` || "cena zł"}
              </Typography>
              <Typography variant="caption">
                {`Cena za ${itemPrice?.howMuch} ${
                  itemPrice?.isPerDay ? "dni" : "godzin"
                } wynajmu.`}
                {`(stawka ${itemPrice?.isPerDay ? "dzienna" : "godzinna"})`}
              </Typography>
              <br />
              {!!loggedUser ? (
                <Button onClick={onSendReservation} variant="contained">
                  Rezerwuję
                </Button>
              ) : (
                <>
                  <Auth
                    users={users}
                    setLoggedUser={setLoggedUser}
                    setUsers={setUsers}
                  />
                </>
              )}
            </div>
            <div className={classes.goBack}>
              <Button
                onClick={() => setIsShowingReservationForm(false)}
                children={"wróć do wyników wyszukiwania"}
              />
            </div>
          </>
        )}
      </CustomContainer>
    </>
  );
};
