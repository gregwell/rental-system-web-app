import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  panel: {
    textAlign: "center",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  reservation: {
    backgroundColor: "white",
    padding: "20px 0",
    borderRadius: "10px",
    paddingBottom: "25px",
  },
});

interface CustomContainerProps {
  children: React.ReactNode;
}

export const CustomContainer = ({ children }: CustomContainerProps) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>{children}</Container>
      </div>
    </>
  );
};

export default CustomContainer;
