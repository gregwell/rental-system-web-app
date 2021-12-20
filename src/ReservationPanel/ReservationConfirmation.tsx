import { Item, ReservationPostBody, User } from "./types";
import { Typography, Container } from "@mui/material";
import { usePostData } from "./usePostData";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Auth from "../Auth";

import { useNavigate } from 'react-router-dom';

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
});

interface ReservationConfirmationProps {
  choosenItem: Item;
  startDate: Date | null;
  finishDate: Date | null;
  isUserLogged: boolean;
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
}

export const ReservationConfirmation = ({
  choosenItem,
  startDate,
  finishDate,
  isUserLogged,
  users,
  loggedUser,
  setLoggedUser,
}: ReservationConfirmationProps) => {
  const { postData } = usePostData();
  const classes = useStyles();
  const navigate = useNavigate();


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
      };
      postData("reservations", reservationPostData);
      navigate('/reservations');
    }
  }, [choosenItem, finishDate, loggedUser, navigate, postData, startDate]);

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <Typography variant="h3">
            {`${choosenItem.producer} ${choosenItem.model}`}
          </Typography>
          <br />
          <Typography>{`Odbiór: ${startDate}`}</Typography>
          <Typography>{`Koniec: ${finishDate}`}</Typography>
          <br />
          <Typography>Cena: 120 zł (7 dni)</Typography>
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
        </Container>
      </div>
    </>
  );
};
