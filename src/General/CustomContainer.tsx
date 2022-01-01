import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  panel: {
    textAlign: (makeStylesProps: {
      backgroundColor: string;
      textAlign: "center" | "left";
    }) => makeStylesProps.textAlign,
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "80px",
  },
  reservation: {
    background: (makeStylesProps: {
      backgroundColor: string;
      textAlign: string;
    }) => makeStylesProps.backgroundColor,
    padding: "20px 0",
    borderRadius: "10px",
    paddingBottom: "25px",
  },
});

interface CustomContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textAlign?: "center" | "left";
}

export const CustomContainer = ({
  children,
  backgroundColor,
  textAlign,
}: CustomContainerProps) => {
  const makeStylesProps = {
    backgroundColor: backgroundColor ? backgroundColor : "white",
    textAlign: textAlign ? textAlign : "center",
  };

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
