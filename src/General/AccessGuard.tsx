import { Alert, AlertTitle, CircularProgress, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomContainer from "./CustomContainer";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  progressContainer: {
    textAlign: "center",
    paddingTop: "100px",
    transform: "scale(1.5)",
  },
});

interface AccessGuardProps {
  deny?: boolean;
  children: React.ReactNode;
  wait?: boolean;
}

const AccessGuard = ({ deny, wait, children }: AccessGuardProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  if (!wait && deny) {
    setTimeout(() => {
      navigate("/");
    }, 2500);
  }

  if (wait) {
    return (
      <Container className={classes.progressContainer}>
        <CircularProgress />
      </Container>
    );
  }

  if (deny) {
    return (
      <CustomContainer textAlign="left">
        <Alert severity="warning">
          <AlertTitle>Brak dostępu!</AlertTitle> 
          Zostaniesz przeniesieony do głównej strony.
        </Alert>
      </CustomContainer>
    );
  }

  return <>{children}</>;
};

export default AccessGuard;
