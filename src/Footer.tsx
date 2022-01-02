import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: "0",
    width: "100%",
    height: "60px",
    background: "#001021",
    color: "white",
    textAlign: "center",
  },
  item: {
    paddingTop: "12px",
  },
  icon: {
    paddingRight: "10px",
  },
});

const Footer = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const onButtonClick = () => {
    navigate("/contact");
  };

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Button onClick={onButtonClick}>
          <LocalPhoneIcon className={classes.icon} />
          kontakt
        </Button>
      </div>
    </div>
  );
};

export default Footer;
