import { Grid, Typography, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  description: {
    paddingTop: "15px",
  },
  textField: {
    width: "100%",
  },
});

interface SingleProfileItemProps {
  caption: string;
  value: string;
  setValue: (val: string) => void;
}

export const SingleProfileItem = ({
  value,
  caption,
  setValue,
}: SingleProfileItemProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={4}>
        <div className={classes.description}>
          <Typography>{caption}</Typography>
        </div>
      </Grid>
      <Grid item xs={8}>
        <TextField
          value={value}
          className={classes.textField}
          onChange={(event) => setValue(event.target.value)}
        />
      </Grid>
    </>
  );
};

export default SingleProfileItem;
