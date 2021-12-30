import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import CustomContainer from "./CustomContainer";
import { useNavigate } from "react-router-dom";

interface AccessGuardProps {
  deny: boolean;
  usersInitialized: boolean;
  children: React.ReactNode;
}

const AccessGuard = ({
  deny,
  children,
  usersInitialized,
}: AccessGuardProps) => {
  const navigate = useNavigate();

  if (usersInitialized && deny) {
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }

  return deny ? (
    <>
      {!!usersInitialized ? (
        <CustomContainer textAlign="left">
          <Alert severity="warning">
            <AlertTitle>Brak dostępu!</AlertTitle>Zostaniesz przeniesiony na
            główną stronę
          </Alert>
        </CustomContainer>
      ) : null}
    </>
  ) : (
    <> {children}</>
  );
};

export default AccessGuard;
