import ReservationPanel from "./ReservationPanel/ReservationPanel";
import Navbar from "./Navbar";
import { User } from "./ReservationPanel/types";
import { useState, useEffect } from "react";
import { useFetchDocuments } from "./ReservationPanel/useFetchDocuments";

import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import MyReservations from "./MyReservations/MyReservations";

function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isUsersInitialized, setIsUsersInitialized] = useState<boolean>(false);

  const { fetchDocuments } = useFetchDocuments();

  useEffect(() => {
    const prepareUsersState = async () => {
      const fetchedItems = await fetchDocuments("users");
      setUsers(fetchedItems as User[]);
      setIsUsersInitialized(true);
    };
    if (!isUsersInitialized) {
      prepareUsersState();
    }
  }, [fetchDocuments, isUsersInitialized]);

  console.log(users);

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
              />
            }
          />
          <Route path="/reservations" element={<MyReservations />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
