import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import CustomContainer from "./CustomContainer";
import { useNavigate } from "react-router-dom";

interface AccessGuardProps {
  deny: boolean;
  loggedUserPrepared: boolean;
  children: React.ReactNode;
}

const AccessGuard = ({
  deny,
  children,
  loggedUserPrepared,
}: AccessGuardProps) => {
  const navigate = useNavigate();

  if (loggedUserPrepared && deny) {
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }

  return deny ? (
    <>
      {!loggedUserPrepared ? (
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
