import React, { useContext} from "react";
import {
  TextField,
  FormLabel,
  Grid,
  Button,
  // Typography,
} from "@material-ui/core";
import AppContext from "../../context/context";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
const useStyles = makeStyles((theme) =>
  createStyles({
    profile: {
      flex: 1,
      minHeight: "100vh",
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
        marginTop: "48px",
      },
    },
    formgrid: { marginBottom: "24px" },
    formlabel: { marginBottom: "8px", fontSize: "18px", color: "#000000" },
    formavatar: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    formtxtfield: {
      backgroundColor: "#ffffff",
    },
  })
);

const Profile = () => {
  const classes = useStyles();
  const { user, avatarApi } = useContext(AppContext);
  const avatarUrl = `${avatarApi}/${user.username}.svg?backgroundColors[]=indigo`;

  const updateUser = () => {};

  return (
    <div className={classes.profile}>
      <Grid justify="center" container>
        <Grid
          item
          lg={8}
          justify="center"
          container
          className={classes.formgrid}
        >
          <Avatar src={avatarUrl} className={classes.formavatar} />
        </Grid>
        <Grid item lg={8} className={classes.formgrid}>
          <FormLabel className={classes.formlabel} component="legend">
            Username
          </FormLabel>
          <TextField
            fullWidth={true}
            id="username"
            name="username"
            className={classes.formtxtfield}
            value={user.username}
            variant="outlined"
          />
        </Grid>
        {/* <Grid item lg={8} className={classes.formgrid}>
          <FormLabel className={classes.formlabel} component="legend">
            Email
          </FormLabel>
          <TextField
            fullWidth={true}
            id="email"
            name="email"
            className={classes.formtxtfield}
            value={user.email}
            variant="outlined"
          />
        </Grid>
        <Grid item lg={8} className={classes.formgrid}>
          <FormLabel className={classes.formlabel} component="legend">
            Phone
          </FormLabel>
          <TextField
            fullWidth={true}
            id="phone"
            name="phone"
            className={classes.formtxtfield}
            value={user.phone}
            variant="outlined"
          />
        </Grid> */}
        <Grid item lg={8} className={classes.formgrid}>
          <Button disabled onClick={updateUser} variant="contained" color="primary">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
