import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import ReservationPanel from "./ReservationPanel/ReservationPanel";
import Navbar from "./Navbar";
import {
  User,
  Reservation,
  CrudOperation,
  Collection,
  Item,
} from "./general/types";
import { sendApiRequest } from "./async/sendApiRequest";
import MyReservations from "./MyReservations/MyReservations";
import MyProfile from "./MyProfile/MyProfile";
import { ReservationFocus } from "./ReservationFocus";
import NotFound from "./general/NotFound";
import { decryptObject, encryptObject } from "./utils";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null | undefined>(
    undefined
  );
  const [loggedUserPrepared, setLoggedUserPrepared] = useState<boolean>(false);

  const [apiDataInitialized, setApiDataInitialized] = useState<boolean>(false);

  const [users, setUsers] = useState<User[] | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [items, setItems] = useState<Item[]>([]);

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

      setItems(fetchedItems as Item[]);
      setUsers(fetchedUsers as User[]);
      setReservations(fetchedReservations as Reservation[]);

      setApiDataInitialized(true);
    };
    if (!apiDataInitialized) {
      prepareApiData();
    }
  }, [apiDataInitialized]);

  return (
    <>
      <Router>
        <Navbar
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          setNewReservationSuccess={setNewReservationSuccess}
          setUsers={setUsers}
        />
        <Routes>
          <Route
            path="/"
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
              />
            }
          />
          <Route
            path="/reservations"
            element={
              <MyReservations
                reservations={reservations}
                newReservationSuccess={newReservationSuccess}
                loggedUser={loggedUser}
                items={items}
                apiDataInitialized={apiDataInitialized}
              />
            }
          />
          <Route
            path="/profile"
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
            path="/reservation/:_id"
            element={
              <ReservationFocus
                reservations={reservations}
                items={items}
                loggedUser={loggedUser}
                setReservations={setReservations}
                apiDataInitialized={apiDataInitialized}
              />
            }
          />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
