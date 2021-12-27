import { Item, ReservationPostBody, User, Status, ItemPrice } from "../General/types";

import { Typography, Container } from "@mui/material";
import { usePostData } from "../Hooks/usePostData";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Auth from "../Auth";
import CustomIcon from "../General/CustomIcon";

import { useNavigate } from "react-router-dom";

import { useCallback } from "react";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  panel: {
    textAlign: "center",
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
  title: {
    paddingBottom: "15px",
  },
  button: {
    height: "55px",
    width: "100%",
  },
  customIcon: {
    transform: "scale(2.5)",
    paddingTop: "20px",
    paddingBottom: "20px",
  }
});

interface ReservationConfirmationProps {
  choosenItem: Item;
  startDate: Date | null;
  finishDate: Date | null;
  isUserLogged: boolean;
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
  pricesTable: ItemPrice[] | null;
  setIsShowingReservationForm: (value: boolean) => void;
}

export const ReservationConfirmation = ({
  choosenItem,
  startDate,
  finishDate,
  isUserLogged,
  users,
  loggedUser,
  setLoggedUser,
  setIsShowingReservationForm,
  pricesTable,
}: ReservationConfirmationProps) => {
  const { postData } = usePostData();
  const classes = useStyles();
  const navigate = useNavigate();

  const itemPrice = pricesTable?.find(
    (priceItem) => priceItem.type === choosenItem.type
  );

  const onSendReservation = useCallback(() => {
    if (
      choosenItem &&
      startDate &&
      finishDate &&
      loggedUser &&
      loggedUser?._id
    ) {
      const reservationPostData: ReservationPostBody = {
        productId: choosenItem.productId,
        userId: loggedUser._id,
        startDate: startDate.toString(),
        finishDate: finishDate.toString(),
        price: "120",
        status: Status.potwierdzona,
      };
      postData("reservations", reservationPostData);
      navigate("/reservations");
    }
  }, [choosenItem, finishDate, loggedUser, navigate, postData, startDate]);

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.customIcon}>
            <CustomIcon type={choosenItem.type}/>
          </div>
          <Typography variant="h3">
            {`${choosenItem.producer} ${choosenItem.model}`}
          </Typography>
          <br />
          <Typography>{`Odbiór: ${startDate}`}</Typography>
          <Typography>{`Koniec: ${finishDate}`}</Typography>
          <br />
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
          <br />
          {!!loggedUser ? (
            <Button onClick={onSendReservation} variant="contained">
              Rezerwuję
            </Button>
          ) : (
            <>
              <Auth
                users={users}
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
              />
            </>
          )}
          <br />
          <br/>
          <Button
            onClick={() => setIsShowingReservationForm(false)}
            children={"wróć do wyników wyszukiwania"}
          />
        </Container>
      </div>
    </>
  );
};
