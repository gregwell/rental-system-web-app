import { Alert, AlertTitle } from "@mui/material";
import CustomContainer from "./CustomContainer";
import { useNavigate } from "react-router-dom";

interface AccessGuardProps {
  deny: boolean;
  children: React.ReactNode;
}

const AccessGuard = ({ deny, children }: AccessGuardProps) => {
  const navigate = useNavigate();

  if (deny) {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  return deny ? (
    <CustomContainer textAlign="left">
      <Alert severity="warning">
        <AlertTitle>Brak dostępu!</AlertTitle>Zostaniesz przeniesiony na główną stronę
      </Alert>
    </CustomContainer>
  ) : (
    <> {children}</>
  );
};

export default AccessGuard;
