import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    stat: {
      flex: 1,
      minHeight: "100vh",
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
    },
    tablecnt: {
      marginTop: theme.spacing(3),
      backgroundColor: "#FFFFFF",
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down("sm")]: {
        width: "350px",
        zIndex: 999,
      },
    },
    tbcell: {
      paddingTop: "12px",
      paddingBottom: "12px",
      fontSize : '16px'
    },
  })
);
export default useStyles;
