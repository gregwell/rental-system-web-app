import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { useFetchDocuments } from "./useFetchDocuments";
import { useState } from "react";
import { useEffect } from "react";
import { Item, Reservation, User } from "./types";
import AvailableItems from "./AvailableItems/AvailableItems";
import { ReservationDateTimePicker } from "./ReservationDateTimePicker";
import { ReservationConfirmation } from "./ReservationConfirmation";

import { useCallback } from "react";

import { getPolishName, canWeRentThisProduct } from "./utils";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  panel: {
    textAlign: "left",
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

interface ReservationPanelProps {
  users: User[] | null;
  loggedUser: User | null;
  setLoggedUser: (value: User | null) => void;
}

const ReservationPanel = ({ users, loggedUser, setLoggedUser }: ReservationPanelProps) => {
  const classes = useStyles();

  const types = ["Narty", "Deski Snowboardowe"];

  const [itemsInitialized, setItemsInitialized] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);

  const [reservationsInitialized, setReservationsInitialized] =
    useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [isShowingReservationForm, setIsShowingReservationForm] =
    useState<boolean>(false);

  const [choosenItem, setChoosenItem] = useState<Item | null>(null);

  const { fetchDocuments } = useFetchDocuments();

  useEffect(() => {
    const prepareItemsState = async () => {
      const fetchedItems = await fetchDocuments("items");
      setItems(fetchedItems as Item[]);
      setItemsInitialized(true);
    };
    if (!itemsInitialized) {
      prepareItemsState();
    }
  }, [fetchDocuments, itemsInitialized]);

  useEffect(() => {
    const prepareReservationsState = async () => {
      const fetchedReservations = await fetchDocuments("reservations");
      setReservations(fetchedReservations as Reservation[]);
      setReservationsInitialized(true);
    };
    if (!reservationsInitialized) {
      prepareReservationsState();
    }
  }, [fetchDocuments, reservationsInitialized]);

  let selectedTimeAvailableItems: Item[] = [];

  if (startDate !== null && finishDate && items && reservations) {
    console.log(items);
    selectedTimeAvailableItems = items.filter((item) => {
      console.log(getPolishName(item.type));
      console.log(type);
      return (
        !canWeRentThisProduct(
          item.productId,
          startDate,
          finishDate,
          reservations
        ) && getPolishName(item.type) === type
      );
    });
    console.log(selectedTimeAvailableItems);
  }

  const onSearchButtonClick = useCallback(() => {
    setIsShowingReservationForm(false);
  }, []);

  const searchPanelText = isShowingReservationForm
    ? "... lub wyszukaj ponownie"
    : "Wybierz termin i sprawdź dostępny sprzęt";

  return (
    <>
      {!!isShowingReservationForm && choosenItem && (
        <ReservationConfirmation
          choosenItem={choosenItem}
          startDate={startDate}
          finishDate={finishDate}
          isUserLogged={false}
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
        />
      )}
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.title}>
            <Typography>{searchPanelText}</Typography>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Autocomplete
                options={types}
                value={type}
                onChange={(e, val) => {
                  setType(val);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Typ sprzętu" />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.25}>
              <ReservationDateTimePicker
                value={startDate}
                setValue={setStartDate}
                label="Data odbioru"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.25}>
              <ReservationDateTimePicker
                value={finishDate}
                setValue={setFinishDate}
                label="Data zwrotu"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={onSearchButtonClick}
              >
                Wyszukaj
              </Button>
            </Grid>
            {isShowingReservationForm === false && (
              <>
                {selectedTimeAvailableItems.length > 0 && (
                  <AvailableItems
                    items={selectedTimeAvailableItems}
                    setIsShowingReservationForm={setIsShowingReservationForm}
                    setChoosenItem={setChoosenItem}
                  />
                )}
              </>
            )}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default ReservationPanel;
