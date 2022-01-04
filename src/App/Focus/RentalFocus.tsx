import {
  Rental,
  CompanyInfo,
  Item,
  User,
  Status,
  ItemType,
} from "../constants/types";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { formatDate } from "../utils";
import { useNavigate, useParams } from "react-router";
import AccessGuard from "../general/AccessGuard";
import CustomContainer from "../general/CustomContainer";
import { colors } from "../constants/colors";
import { Grid, Typography, Button } from "@mui/material";
import CustomIcon from "../general/CustomIcon";
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
    background: (makeStylesProps: { isArchived: boolean }) => {
      if (makeStylesProps.isArchived) {
        return "black";
      }
      return "linear-gradient(to right, #0575e6, #1F38A1)";
    },
    paddingTop: "30px",
    borderRadius: "5px",
    paddingBottom: "30px",
    opacity: (makeStylesProps: { isArchived: boolean }) =>
      makeStylesProps.isArchived ? "20%" : "100%",
    "&:hover": {
      opacity: "100%",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
  },
  reservationText: {
    color: "white",
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

interface RentalFocusProps {
  rentals: Rental[] | null;
  items: Item[] | null;
  loggedUser: User | null | undefined;
  apiDataInitialized: boolean;
  companyInfo?: CompanyInfo;
}

const RentalFocus = ({
  rentals,
  items,
  loggedUser,
  apiDataInitialized,
  companyInfo,
}: RentalFocusProps) => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | undefined | null>(undefined);
  const [rentalPrepared, setRentalPrepared] = useState<boolean>(false);

  useEffect(() => {
    const prepareReservationState = () => {
      const foundRental = rentals?.find((r) => r._id === _id);

      if (!foundRental) {
        navigate("*");
        return;
      }

      const userHasPermission = loggedUser?._id === foundRental?.userId;

      if (userHasPermission) {
        setRental(foundRental);
      }

      if (!userHasPermission) {
        setRental(null);
      }
    };
    if (apiDataInitialized) {
      prepareReservationState();
      setRentalPrepared(true);
    }
  }, [_id, apiDataInitialized, loggedUser?._id, navigate, rentals]);

  const item = items?.find((i) => i.productId === rental?.productId);

  const startDateFormatted = formatDate(rental?.startDate);
  const finishDateFormatted = formatDate(rental?.finishDate);

  const makeStylesProps = {
    isArchived: rental?.status === "false",
  };

  const classes = useStyles(makeStylesProps);

  const things = [
    `Data odbioru: ${startDateFormatted}`,
    `Status: ${rental?.status === "true" ? "aktywna" : "archiwalna"}`,
  ];

  if (rental?.status === "false") {
    things.push(`Data zwrotu: ${finishDateFormatted}`);
  }

  return (
    <AccessGuard
      wait={loggedUser === undefined || !rentalPrepared}
      deny={rental === null}
    >
      <CustomContainer
        textAlign="left"
        backgroundColor={
          rental?.status === "true" ? colors.rental : colors.confirmedArchived
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

          <ContactField
            item={item}
            reservation={rental}
            companyInfo={companyInfo}
            startDateFormatted={startDateFormatted}
            finishDateFormatted={finishDateFormatted}
            loggedUser={loggedUser}
          />
        </Grid>
      </CustomContainer>
    </AccessGuard>
  );
};

export default RentalFocus;
