import { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Container,
  Autocomplete,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import {
  Item,
  User,
  Reservation,
  Price,
  ItemPrice,
  CompanyInfo,
} from "../constants/types";
import AvailableItems from "./AvailableItems/AvailableItems";
import { ReservationDateTimePicker } from "./ReservationDateTimePicker";
import { ReservationConfirmation } from "./ReservationConfirmation";
import {
  calculateReservationPriceForEachType,
  getPolishName,
  filterOutReservedItems,
  groupItems,
  removeBackupItems,
} from "./utils";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  panel: {
    textAlign: "left",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "80px",
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
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  items: Item[] | null;
  loggedUser: User | null | undefined;
  setLoggedUser: (value: User | null | undefined) => void;
  reservations: Reservation[] | null;
  setNewReservationSuccess: (newValue: boolean | null) => void;
  newReservationSuccess: boolean | null;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  companyInfo: CompanyInfo;
  prices: Price[];
}

const ReservationPanel = ({
  users,
  setUsers,
  loggedUser,
  setLoggedUser,
  reservations,
  setNewReservationSuccess,
  newReservationSuccess,
  setReservations,
  items,
  prices,
  companyInfo,
}: ReservationPanelProps) => {
  const classes = useStyles();

  const uniqueTypes = items
    ? new Set(items.map((item) => item.type as string))
    : [];

  const types = Array.from(uniqueTypes).map((type) => getPolishName(type));
  const [pricesTable, setPricesTable] = useState<ItemPrice[] | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [isShowingReservationForm, setIsShowingReservationForm] =
    useState<boolean>(false);

  const [choosenItem, setChoosenItem] = useState<Item | null>(null);

  useEffect(() => {
    setPricesTable(
      calculateReservationPriceForEachType(prices, startDate, finishDate)
    );
  }, [prices, startDate, finishDate]);

  const itemsLessByPercentage = groupItems({
    items: items,
    bysize: true,
  });

  const itemsWithoutBackups = removeBackupItems(
    itemsLessByPercentage,
    companyInfo?.percentage as string
  );

  const itemsWithoutBackupsArray = Object.values(itemsWithoutBackups).flat();

  const filteredItems = filterOutReservedItems(
    startDate,
    finishDate,
    reservations,
    itemsWithoutBackupsArray
  );
  const groupedFilteredItems = groupItems({ items: filteredItems });

  const onSearchButtonClick = useCallback(() => {
    setIsShowingReservationForm(false);
    setNewReservationSuccess(null);
  }, [setNewReservationSuccess]);

  const searchPanelText =
    newReservationSuccess === false
      ? "Wyszukaj ponownie"
      : isShowingReservationForm
      ? "... lub wyszukaj ponowie"
      : "Wybierz termin i sprawdź dostępny sprzęt";

  const open = parseInt(companyInfo?.open as string);
  const close = parseInt(companyInfo?.close as string);

  const showWrongHoursAlert =
    startDate &&
    finishDate &&
    companyInfo &&
    (startDate.getHours() < open ||
      startDate.getHours() >= close ||
      finishDate.getHours() < open ||
      finishDate.getHours() >= close);

  const showReturnBeforePickupAlert =
    startDate &&
    finishDate &&
    finishDate.getTime() < startDate.getTime() + 3599999;

  const ReservationTimeAlert = () => {
    if (showWrongHoursAlert) {
      return (
        <Alert severity="warning">{`Conajmniej jedna wybrana godzina odbioru/zwrotu znajduje się poza godzinami pracy wypożyczalni (${companyInfo?.open} - ${companyInfo?.close}). Wybierz inne godziny.`}</Alert>
      );
    }

    if (showReturnBeforePickupAlert) {
      return (
        <Alert severity="warning">{`Wybrane godziny są nieprawidłowe. Minimalny czas wynajmu to jedna godzina.`}</Alert>
      );
    }

    if (Object.keys(groupedFilteredItems).length > 0) {
      return null;
    }

    return (
      <Alert severity="info">{`Wypożyczalnia czynna w godzinach ${companyInfo?.open} - ${companyInfo?.close}.  Miej to na uwadze wybierając godziny wynajmu. `}</Alert>
    );
  };

  const showAvailableItems =
    !isShowingReservationForm &&
    Object.keys(groupedFilteredItems).length > 0 &&
    !showWrongHoursAlert &&
    !showReturnBeforePickupAlert;

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
          setUsers={setUsers}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          pricesTable={pricesTable}
          setNewReservationSuccess={setNewReservationSuccess}
          newReservationSuccess={newReservationSuccess}
          setReservations={setReservations}
        />
      )}
      <div className={classes.panel}>
        <Container className={classes.reservation}>
          <div className={classes.title}>
            <Typography variant="h5">{searchPanelText}</Typography>
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
                maxDate={finishDate}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.25}>
              <ReservationDateTimePicker
                value={finishDate}
                setValue={setFinishDate}
                label="Data zwrotu"
                minDate={startDate}
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
            <Grid item xs={12}>
              <ReservationTimeAlert />
            </Grid>
            {showAvailableItems && (
              <AvailableItems
                items={groupedFilteredItems}
                setIsShowingReservationForm={setIsShowingReservationForm}
                setChoosenItem={setChoosenItem}
                pricesTable={pricesTable}
              />
            )}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default ReservationPanel;
