import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { init } from "@emailjs/browser";

import ReservationPanel from "./ReservationPanel/ReservationPanel";
import Navbar from "./Navbar/Navbar";
import {
  User,
  Reservation,
  CrudOperation,
  Collection,
  Item,
  Rental,
  Price,
  CompanyInfo,
  Path,
  State,
} from "./constants/types";
import { sendApiRequest } from "./async/sendApiRequest";
import MyServices from "./MyServices/MyServices";
import MyProfile from "./MyProfile/MyProfile";
import ReservationFocus from "./Focus/ReservationFocus";
import RentalFocus from "./Focus/RentalFocus";
import NotFound from "./NotFound";
import { decryptObject, encryptObject } from "./utils";
import Footer from "./Footer";
import Contact from "./Contact";
import AccessGuard from "./general/AccessGuard";
import ConfirmEmail from "./ConfirmEmail";

init(process.env.REACT_APP_EMAILJS as string);

function App() {
  const [loggedUserInitialized, setLoggedUserInitialized] =
    useState<boolean>(false);
  const [apiDataInitialized, setApiDataInitialized] = useState<boolean>(false);

  const [state, dispatch] = useState<State>({} as State);

  useEffect(() => {
    const prepareLoggedUserState = () => {
      const localStorageItem = localStorage.getItem("user");

      if (localStorageItem && localStorageItem !== "") {
        dispatch((prev: State) => ({
          ...prev,
          state: decryptObject(JSON.parse(localStorageItem)),
        }));
      }

      if (!localStorageItem) {
        dispatch((prev: State) => ({ ...prev, state: null }));
      }
      setLoggedUserInitialized(true);
    };
    if (!loggedUserInitialized) {
      prepareLoggedUserState();
    }
  }, [loggedUserInitialized]);

  useEffect(() => {
    if (state.loggedUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(encryptObject(state.loggedUser))
      );
    }
  }, [state.loggedUser]);

  useEffect(() => {
    if (state.companyInfo?.title) {
      localStorage.setItem("title", state.companyInfo.title);
    }
  }, [state.companyInfo?.title]);

  useEffect(() => {
    const prepareApiData = async () => {
      const collections = [
        Collection.reservations,
        Collection.users,
        Collection.items,
        Collection.company,
        Collection.rentals,
        Collection.prices,
      ];

      const [reservations, users, items, companyInfo, rentals, prices] =
        await Promise.all(
          collections.map((collection) =>
            sendApiRequest({
              collection: collection,
              operation: CrudOperation.READ,
            })
          )
        );

      dispatch((prev: State) => ({
        ...prev,
        items: items as Item[],
        users: users as User[],
        prices: prices as Price[],
        rentals: rentals as Rental[],
        reservations: reservations as Reservation[],
        companyInfo: companyInfo[0] as CompanyInfo,
      }));

      setApiDataInitialized(true);
    };
    if (!apiDataInitialized) {
      prepareApiData();
    }
  }, [apiDataInitialized]);

  return (
    <Router>
      <Navbar state={state} dispatch={dispatch} />
      <AccessGuard wait={!apiDataInitialized}>
        <Routes>
          <Route
            path={Path.home}
            element={<ReservationPanel state={state} dispatch={dispatch} />}
          />

          <Route
            path={Path.services}
            element={
              <MyServices
                state={state}
                dispatch={dispatch}
                apiDataInitialized={apiDataInitialized}
              />
            }
          />

          <Route
            path={Path.profile}
            element={<MyProfile state={state} dispatch={dispatch} />}
          />

          <Route
            path={`${Path.singleReservation}/:_id`}
            element={
              <ReservationFocus
                apiDataInitialized={apiDataInitialized}
                state={state}
                dispatch={dispatch}
              />
            }
          />

          <Route
            path={`${Path.singleRental}/:_id`}
            element={
              <RentalFocus
                apiDataInitialized={apiDataInitialized}
                state={state}
              />
            }
          />

          <Route
            path={`${Path.confirmEmail}/:token`}
            element={
              <ConfirmEmail
                apiDataInitialized={apiDataInitialized}
                state={state}
                dispatch={dispatch}
              />
            }
          />

          <Route
            path={Path.contact}
            element={<Contact companyInfo={state.companyInfo} />}
          />
          <Route path={Path.notFound} element={<NotFound />} />
        </Routes>
      </AccessGuard>
      <Footer />
    </Router>
  );
}

export default App;
