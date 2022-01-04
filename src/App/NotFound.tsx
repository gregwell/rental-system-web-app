import CustomContainer from "./general/CustomContainer";
import { Alert, AlertTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Path } from "./constants/types";

export const NotFound = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate(Path.home);
  }, 4000);

  return (
    <div>
      <CustomContainer>
        <Alert severity="info">
          <AlertTitle>Strona o takim adresie nie istnieje!</AlertTitle>
          Zostaniesz przeniesiony na główną stronę
        </Alert>
      </CustomContainer>
    </div>
  );
};

export default NotFound;
