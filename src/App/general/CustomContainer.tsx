import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

interface MakeStylesProps {
  backgroundColor: string;
  textAlign: "left" | "center" | "right";
  paddingBottom: string;
}

const useStyles = makeStyles({
  panel: {
    textAlign: (makeStylesProps: MakeStylesProps) => makeStylesProps.textAlign,
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: (makeStylesProps: MakeStylesProps) =>
      makeStylesProps.paddingBottom,
  },
  reservation: {
    background: (makeStylesProps: MakeStylesProps) =>
      makeStylesProps.backgroundColor,
    padding: "20px 0",
    borderRadius: "10px",
    paddingBottom: "25px",
  },
});

interface CustomContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textAlign?: "center" | "left";
  noPaddingBottom?: boolean;
}

export const CustomContainer = ({
  children,
  backgroundColor,
  textAlign,
  noPaddingBottom,
}: CustomContainerProps) => {
  const makeStylesProps = {
    backgroundColor: backgroundColor ? backgroundColor : "white",
    textAlign: textAlign ? textAlign : "center",
    paddingBottom: noPaddingBottom ? "0px" : "80px",
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
