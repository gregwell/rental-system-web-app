import ReservationPanel from "./ReservationPanel/ReservationPanel";
import Navbar from "./Navbar";
import { User, Reservation } from "./General/types";
import { useState, useEffect } from "react";
import { useFetchDocuments } from "./ReservationPanel/useFetchDocuments";

import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import MyReservations from "./MyReservations/MyReservations";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isUsersInitialized, setIsUsersInitialized] = useState<boolean>(false);

  const [reservationsInitialized, setReservationsInitialized] =
    useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const { fetchDocuments } = useFetchDocuments();

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

  useEffect(() => {
    const prepareUsersState = async () => {
      const fetchedItems = await fetchDocuments("users");
      setUsers(fetchedItems as User[]);
      setIsUsersInitialized(true);
    };
    if (!isUsersInitialized) {
      prepareUsersState();
    }
  }, [fetchDocuments, isUsersInitialized, loggedUser]);

  return (
    <>
      <Router>
        <Navbar
          users={users}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
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
              />
            }
          />
          <Route path="/reservations" element={<MyReservations reservations={reservations}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
