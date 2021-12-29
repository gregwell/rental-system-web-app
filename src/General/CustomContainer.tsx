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
    background: (makeStylesProps: { backgroundColor: string }) =>
      makeStylesProps.backgroundColor,
    padding: "20px 0",
    borderRadius: "10px",
    paddingBottom: "25px",
  },
});

interface CustomContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const CustomContainer = ({
  children,
  backgroundColor,
}: CustomContainerProps) => {
  const makeStylesProps = {
    backgroundColor: backgroundColor ? backgroundColor : "white",
  };

  console.log(backgroundColor);

  const classes = useStyles(makeStylesProps);

  return (
    <>
      <div className={classes.panel}>
        <Container className={classes.reservation}>{children}</Container>
      </div>
    </>
  );
};

export default CustomContainer;
