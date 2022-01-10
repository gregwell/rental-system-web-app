import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

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
} from "./constants/types";
import { sendApiRequest } from "./async/sendApiRequest";
import MyServices from "./MyServices/MyServices";
import MyProfile from "./MyProfile/MyProfile";
import ReservationFocus from "./Focus/ReservationFocus";
import RentalFocus from "./Focus/RentalFocus";
import NotFound from "./NotFound";
import { decryptObject, encrypt, encryptObject } from "./utils";
import { init } from "@emailjs/browser";
import Footer from "./Footer";
import Contact from "./Contact";
import AccessGuard from "./general/AccessGuard";
import ConfirmEmail from "./ConfirmEmail";

init(process.env.REACT_APP_EMAILJS as string);

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null | undefined>(
    undefined
  );
  const [loggedUserPrepared, setLoggedUserPrepared] = useState<boolean>(false);

  const [apiDataInitialized, setApiDataInitialized] = useState<boolean>(false);

  const [users, setUsers] = useState<User[] | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(
    {} as CompanyInfo
  );

  const [newReservationSuccess, setNewReservationSuccess] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const prepareLoggedUserState = () => {
      const localStorageItem = localStorage.getItem("user");

      if (localStorageItem && localStorageItem !== "") {
        setLoggedUser(decryptObject(JSON.parse(localStorageItem)));
      }

      if (!localStorageItem) {
        setLoggedUser(null);
      }
      setLoggedUserPrepared(true);
    };
    if (!loggedUserPrepared) {
      prepareLoggedUserState();
    }
  }, [loggedUserPrepared]);

  useEffect(() => {
    if (loggedUser) {
      localStorage.setItem("user", JSON.stringify(encryptObject(loggedUser)));
    }
  }, [loggedUser]);

  useEffect(() => {
    if (companyInfo?.title) {
      localStorage.setItem("title", companyInfo.title);
    }
  }, [companyInfo.title]);

  useEffect(() => {
    const prepareApiData = async () => {
      const fetchedReservations = await sendApiRequest({
        collection: Collection.reservations,
        operation: CrudOperation.READ,
      });
      const fetchedUsers = await sendApiRequest({
        collection: Collection.users,
        operation: CrudOperation.READ,
      });
      const fetchedItems = await sendApiRequest({
        collection: Collection.items,
        operation: CrudOperation.READ,
      });
      const fetchedCompanyInfo = await sendApiRequest({
        collection: Collection.company,
        operation: CrudOperation.READ,
      });
      const fetchedRentals = await sendApiRequest({
        collection: Collection.rentals,
        operation: CrudOperation.READ,
      });
      const fetchedPrices = await sendApiRequest({
        collection: Collection.prices,
        operation: CrudOperation.READ,
      });

      setItems(fetchedItems as Item[]);
      setUsers(fetchedUsers as User[]);
      setPrices(fetchedPrices as Price[]);
      setRentals(fetchedRentals as Rental[]);
      setReservations(fetchedReservations as Reservation[]);
      setCompanyInfo(fetchedCompanyInfo[0] as CompanyInfo);

      setApiDataInitialized(true);
    };
    if (!apiDataInitialized) {
      prepareApiData();
    }
  }, [apiDataInitialized]);

  console.log(encrypt("admin"));

  return (
    <Router>
      <Navbar
        users={users}
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
        setNewReservationSuccess={setNewReservationSuccess}
        setUsers={setUsers}
      />
      <AccessGuard wait={!apiDataInitialized}>
        <Routes>
          <Route
            path={Path.home}
            element={
              <ReservationPanel
                users={users}
                setUsers={setUsers}
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                reservations={reservations}
                setNewReservationSuccess={setNewReservationSuccess}
                newReservationSuccess={newReservationSuccess}
                setReservations={setReservations}
                items={items}
                companyInfo={companyInfo}
                prices={prices}
              />
            }
          />

          <Route
            path={Path.services}
            element={
              <MyServices
                reservations={reservations}
                newReservationSuccess={newReservationSuccess}
                loggedUser={loggedUser}
                items={items}
                apiDataInitialized={apiDataInitialized}
                rentals={rentals}
                prices={prices}
              />
            }
          />

          <Route
            path={Path.profile}
            element={
              <MyProfile
                loggedUser={loggedUser}
                users={users}
                setUsers={setUsers}
                setLoggedUser={setLoggedUser}
              />
            }
          />

          <Route
            path={`${Path.singleReservation}/:_id`}
            element={
              <ReservationFocus
                reservations={reservations}
                items={items}
                loggedUser={loggedUser}
                setReservations={setReservations}
                apiDataInitialized={apiDataInitialized}
                companyInfo={companyInfo}
              />
            }
          />

          <Route
            path={`${Path.singleRental}/:_id`}
            element={
              <RentalFocus
                rentals={rentals}
                items={items}
                loggedUser={loggedUser}
                apiDataInitialized={apiDataInitialized}
                companyInfo={companyInfo}
                prices={prices}
              />
            }
          />

          <Route
            path={`${Path.confirmEmail}/:token`}
            element={
              <ConfirmEmail
                setLoggedUser={setLoggedUser}
                users={users}
                apiDataInitialized={apiDataInitialized}
              />
            }
          />

          <Route
            path={Path.contact}
            element={<Contact companyInfo={companyInfo} />}
          />
          <Route path={Path.notFound} element={<NotFound />} />
        </Routes>
      </AccessGuard>
      <Footer />
    </Router>
  );
}

export default App;
