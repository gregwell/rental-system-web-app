import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { sendApiRequest } from "../Async/sendApiRequest";
import { useState } from "react";
import { useEffect } from "react";
import {
  Item,
  User,
  Reservation,
  Price,
  ItemPrice,
  CrudOperation,
} from "../General/types";
import AvailableItems from "./AvailableItems/AvailableItems";
import { ReservationDateTimePicker } from "./ReservationDateTimePicker";
import { ReservationConfirmation } from "./ReservationConfirmation";
import { calculateReservationPriceForEachType, getPolishName } from "./utils";

import { useCallback } from "react";

import { canWeRentThisProduct } from "./utils";

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
  reservations: Reservation[] | null;
}

const ReservationPanel = ({
  users,
  loggedUser,
  setLoggedUser,
  reservations,
}: ReservationPanelProps) => {
  const classes = useStyles();

  const [itemsInitialized, setItemsInitialized] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);

  const uniqueTypes = itemsInitialized
    ? new Set(items.map((item) => item.type as string))
    : [];

  const types = Array.from(uniqueTypes).map((type) => getPolishName(type));

  const [pricesInitialized, setPricesInitialized] = useState<boolean>(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [pricesTable, setPricesTable] = useState<ItemPrice[] | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [isShowingReservationForm, setIsShowingReservationForm] =
    useState<boolean>(false);

  const [choosenItem, setChoosenItem] = useState<Item | null>(null);

  useEffect(() => {
    const prepareItemsState = async () => {
      const fetchedItems = await sendApiRequest({
        collection: "items",
        operation: CrudOperation.READ,
      });
      setItems(fetchedItems as Item[]);
      setItemsInitialized(true);
    };
    if (!itemsInitialized) {
      prepareItemsState();
    }
  }, [itemsInitialized]);

  useEffect(() => {
    setPricesTable(
      calculateReservationPriceForEachType(prices, startDate, finishDate)
    );
  }, [prices, startDate, finishDate]);

  useEffect(() => {
    const preparePricesState = async () => {
      const fetchedPrices = await sendApiRequest({
        collection: "prices",
        operation: CrudOperation.READ,
      });
      setPrices(fetchedPrices as Price[]);
      setPricesInitialized(true);
    };
    if (!pricesInitialized) {
      preparePricesState();
    }
  }, [itemsInitialized, pricesInitialized]);

  let selectedTimeAvailableItems: Item[] = [];

  if (startDate !== null && finishDate && items && reservations) {
    selectedTimeAvailableItems = items.filter((item) => {
      return (
        canWeRentThisProduct(
          item.productId,
          startDate,
          finishDate,
          reservations
        ) &&
        (!type || getPolishName(item.type) === type)
      );
    });
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
          setIsShowingReservationForm={setIsShowingReservationForm}
          startDate={startDate}
          finishDate={finishDate}
          isUserLogged={false}
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          pricesTable={pricesTable}
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
                    pricesTable={pricesTable}
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
