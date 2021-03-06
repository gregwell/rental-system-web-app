import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Typography, Button, Alert, AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";

import {
  Item,
  Reservation,
  State,
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
  pricesTable: ItemPrice[] | null;
  setIsShowingReservationForm: (value: boolean) => void;
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
}

export const ReservationConfirmation = ({
  choosenItem,
  startDate,
  finishDate,
  setIsShowingReservationForm,
  pricesTable,
  state,
  dispatch,
}: ReservationConfirmationProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const itemPrice = pricesTable?.find(
    (priceItem) => priceItem.type === choosenItem.type
  );

  const [currentReservation, setCurrentReservation] = useState<Reservation>();

  useEffect(() => {
    if (state.newReservationSuccess === true) {
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

      dispatch((prev: State) => ({
        ...state,
        reservations: [
          ...prev.reservations,
          currentReservation,
        ] as Reservation[],
      }));
    }
  }, [currentReservation, dispatch, navigate, state]);

  const onSendReservation = useCallback(async () => {
    if (choosenItem && startDate && finishDate && state.loggedUser) {
      const reservationPostData: Reservation = {
        productId: choosenItem.productId,
        userId: state.loggedUser._id as string,
        startDate: startDate.getTime().toString(),
        finishDate: finishDate.getTime().toString(),
        price: itemPrice?.price.toString() as string,
        status: Status.confirmed,
      };

      setCurrentReservation(reservationPostData);

      const setNewReservationSuccess = (success: boolean) => {
        dispatch((prev: State) => ({
          ...prev,
          newReservationSuccess: success,
        }));
      };

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
    dispatch,
    finishDate,
    itemPrice?.price,
    startDate,
    state.loggedUser,
  ]);

  if (!startDate || !finishDate) {
    return null;
  }

  return (
    <>
      <CustomContainer noPaddingBottom>
        {state.newReservationSuccess === false ? (
          <div className={classes.title}>
            <Alert severity="error">
              <AlertTitle>B????d!</AlertTitle>
              Niestety nie uda??o si?? dokona?? rezerwacji. Skontakuj si?? z
              pracownikiem wypo??yczalni lub wybierz inny produkt / termin.
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

              <Typography>{`Odbi??r: ${formatDate(
                startDate.getTime()
              )}`}</Typography>
              <Typography>{`Koniec: ${formatDate(
                finishDate.getTime()
              )}`}</Typography>

              <Typography variant="h5">
                {`${itemPrice?.price} z??` || "cena z??"}
              </Typography>
              <Typography variant="caption">
                {`Cena za ${itemPrice?.howMuch} ${
                  itemPrice?.isPerDay ? "dni" : "godzin"
                } wynajmu.`}
                {`(stawka ${itemPrice?.isPerDay ? "dzienna" : "godzinna"})`}
              </Typography>
              <br />
              {!!state.loggedUser ? (
                <Button onClick={onSendReservation} variant="contained">
                  Rezerwuj??
                </Button>
              ) : (
                <Auth state={state} dispatch={dispatch} />
              )}
            </div>
            <div className={classes.goBack}>
              <Button
                onClick={() => setIsShowingReservationForm(false)}
                children={"wr???? do wynik??w wyszukiwania"}
              />
            </div>
          </>
        )}
      </CustomContainer>
    </>
  );
};
