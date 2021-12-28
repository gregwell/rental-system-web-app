import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import ReservationPanel from "./ReservationPanel/ReservationPanel";
import Navbar from "./Navbar";
import { User, Reservation, CrudOperation, Collection } from "./general/types";
import { sendApiRequest } from "./async/sendApiRequest";
import MyReservations from "./MyReservations/MyReservations";
import MyProfile from "./MyProfile/MyProfile";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isUsersInitialized, setIsUsersInitialized] = useState<boolean>(false);

  const [reservationsInitialized, setReservationsInitialized] =
    useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [newReservationSuccess, setNewReservationSuccess] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const prepareReservationsState = async () => {
      const fetchedReservations = await sendApiRequest({
        collection: Collection.reservations,
        operation: CrudOperation.READ,
      });
      setReservations(fetchedReservations as Reservation[]);
      setReservationsInitialized(true);
    };
    if (!reservationsInitialized) {
      prepareReservationsState();
    }
  }, [reservationsInitialized]);

  useEffect(() => {
    const prepareUsersState = async () => {
      const fetchedUsers = await sendApiRequest({
        collection: Collection.users,
        operation: CrudOperation.READ,
      });
      setUsers(fetchedUsers as User[]);
      setIsUsersInitialized(true);
    };
    if (!isUsersInitialized) {
      prepareUsersState();
    }
  }, [isUsersInitialized]);

  return (
    <>
      <Router>
        <Navbar
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          setNewReservationSuccess={setNewReservationSuccess}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ReservationPanel
                users={users}
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                reservations={reservations}
                setNewReservationSuccess={setNewReservationSuccess}
                newReservationSuccess={newReservationSuccess}
                setReservations={setReservations}
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
