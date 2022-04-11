import { Typography, Grid, Button } from "@mui/material";
import {
  Reservation,
  ItemType,
  Status,
  Collection,
  CrudOperation,
  Path,
  StateProps,
  State,
} from "../constants/types";

import { makeStyles } from "@mui/styles";
import { useParams, useNavigate } from "react-router-dom";
import CustomContainer from "../general/CustomContainer";
import CustomIcon from "../general/CustomIcon";
import { formatDate } from "../utils";
import { colors } from "../constants/colors";
import { useState, useEffect } from "react";
import AccessGuard from "../general/AccessGuard";
import { sendApiRequest } from "../async/sendApiRequest";
import ContactField from "./ContactField";

const useStyles = makeStyles({
  focus: {
    height: "100px",
    width: "100px",
    backgroundColor: "red",
  },
  singlePanel: {
    paddingTop: "12px",
    cursor: "pointer",
  },
  singleReservation: {
    background: (makeStylesProps: {
      isCancelled: boolean;
      isArchived: boolean;
    }) => {
      if (makeStylesProps.isCancelled) {
        return "#bebebe";
      }
      if (makeStylesProps.isArchived) {
        return "black";
      }
      return "linear-gradient(to right, #0575e6, #1F38A1)";
    },
    paddingTop: "30px",
    borderRadius: "5px",
    paddingBottom: "30px",
    opacity: (makeStylesProps: { isCancelled: boolean; isArchived: boolean }) =>
      makeStylesProps.isArchived ? "20%" : "100%",
    "&:hover": {
      opacity: "100%",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
  },
  reservationText: {
    color: (makeStylesProps: { isCancelled: boolean; isArchived: boolean }) =>
      makeStylesProps.isCancelled ? "#787878" : "white",
    textAlign: "left",
  },
  singleReservationItem: {
    backgroundColor: "#001428",
    borderRadius: "3px",
    padding: "10px 0",
  },
  lastItem: {
    textAlign: "right",
  },
  white: {
    textColor: "white",
  },
  icon: {
    paddingTop: "20px",
    paddingLeft: "40px",
  },
  alert: {
    textAlign: "left",
  },
});

interface ReservationFocusProps extends StateProps {
  apiDataInitialized: boolean;
}

export const ReservationFocus = ({
  state,
  dispatch,
  apiDataInitialized,
}: ReservationFocusProps) => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [updateDataSuccesful, setUpdateDataSuccesful] = useState<
    boolean | null
  >(null);

  const [reservation, setReservation] = useState<
    Reservation | undefined | null
  >(undefined);
  const [reservationPrepared, setReservationPrepared] =
    useState<boolean>(false);

  useEffect(() => {
    const prepareReservationState = () => {
      const foundReservation = state.reservations?.find((r) => r._id === _id);

      if (!foundReservation) {
        navigate(Path.notFound);
        return;
      }

      const userHasPermission =
        state.loggedUser?._id === foundReservation?.userId;

      if (userHasPermission) {
        setReservation(foundReservation);
      }

      if (!userHasPermission) {
        setReservation(null);
      }
    };
    if (apiDataInitialized) {
      prepareReservationState();
      setReservationPrepared(true);
    }
  }, [
    _id,
    apiDataInitialized,
    navigate,
    state.loggedUser?._id,
    state.reservations,
  ]);

  const item = state.items?.find((i) => i.productId === reservation?.productId);

  const makeStylesProps = {
    isCancelled: reservation?.status === Status.cancelled ? true : false,
    isArchived: parseInt(reservation?.startDate as string) < Date.now(),
  };

  const classes = useStyles(makeStylesProps);

  const startDateFormatted = formatDate(reservation?.startDate);
  const finishDateFormatted = formatDate(reservation?.finishDate);

  const getBgColor = (status: Status | undefined): string => {
    switch (status) {
      case Status.cancelled:
        return colors.cancelled;
      case Status.confirmed:
        return parseInt(reservation?.startDate as string) > Date.now()
          ? colors.confirmed
          : colors.confirmedArchived;
      default:
        return "white";
    }
  };

  const onCancelReservation = async () => {
    if (!state.loggedUser) {
      return;
    }

    const updated: any = {};
    updated.status = Status.cancelled;

    await sendApiRequest({
      collection: Collection.reservations,
      operation: CrudOperation.UPDATE,
      filter: { _id: { $oid: reservation?._id } },
      update: {
        $set: updated,
      },
      setState: setUpdateDataSuccesful,
    });

    if (updateDataSuccesful === false) {
      return;
    }

    const updatedReservation = {
      _id: _id as string,
      productId: reservation?.productId as string,
      userId: reservation?.userId as string,
      startDate: reservation?.startDate as string,
      finishDate: reservation?.finishDate as string,
      price: reservation?.price as string,
      status: Status.cancelled as Status,
    };

    setReservation(updatedReservation);

    if (!state.reservations) {
      dispatch((prev: State) => ({
        ...prev,
        reservations: [updatedReservation],
      }));
      return;
    }

    const updatedReservations = state.reservations.reduce((acc, curr) => {
      const reservation = curr._id === _id ? updatedReservation : curr;
      acc.push(reservation);
      return acc;
    }, [] as Reservation[]);

    dispatch((prev: State) => ({ ...prev, reservations: updatedReservations }));
  };

  const things = [
    `Data odbioru: ${startDateFormatted}`,
    `Data zwrotu: ${finishDateFormatted}`,
    `Cena: ${reservation?.price as string} zł`,
    `Status: ${reservation?.status}`,
  ];

  return (
    <AccessGuard
      wait={state.loggedUser === undefined || !reservationPrepared}
      deny={reservation === null}
    >
      <CustomContainer
        textAlign="left"
        backgroundColor={
          state.loggedUser ? getBgColor(reservation?.status) : "white"
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={3} sm={3} md={2} lg={1.5}>
            <div className={classes.reservationText}>
              <div className={classes.icon}>
                <CustomIcon type={item?.type as ItemType} scale={"3.5"} />
              </div>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h3" className={classes.reservationText}>
              {item && `${item.producer} ${item.model}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.reservationText}>
              {item && `Rozmiar: ${item.size}`}
            </Typography>
          </Grid>

          {things.map((thing) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={12}
              className={classes.reservationText}
              key={thing}
            >
              <Typography variant="h5" className={classes.reservationText}>
                {thing}
              </Typography>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={12}>
            {reservation?.status !== Status.cancelled &&
              parseInt(reservation?.startDate as string) > Date.now() && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={onCancelReservation}
                >
                  Anuluj rezerwację
                </Button>
              )}
          </Grid>
          <ContactField
            item={item}
            service={reservation}
            startDateFormatted={startDateFormatted}
            finishDateFormatted={finishDateFormatted}
            state={state}
          />
        </Grid>
      </CustomContainer>
    </AccessGuard>
  );
};

export default ReservationFocus;
