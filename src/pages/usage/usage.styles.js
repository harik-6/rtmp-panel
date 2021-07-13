import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    usage: {
      padding: theme.spacing(5),
      flex:1,
      minHeight:"100vh",
      backgroundColor: "#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
        marginTop: "48px",
      },
    },
    chcardcnt: {
      marginTop: "48px",
      [theme.breakpoints.down("sm")]: {
        width: "350px",
      },
    },
    graphSpace: {
      [theme.breakpoints.down("sm")]: {
        width: "350px",
      },
    },
    preloadercnt: {
      height: "400px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxt: { fontSize: "20px", marginTop: "16px" },
    preloadercntloader: {
      height: "700px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxtloader: { fontSize: "20px", marginTop: "16px" },
    tbcell: {
      paddingTop: "4px",
      paddingBottom: "4px",
    },
    countCnt: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      minHeight: "100px",
      borderRadius: "8px",
      [theme.breakpoints.down("sm")]: {
        margin: "8px 16px",
      },
    },
    countHeader: {
      paddingBottom: "8px",
      paddingTop: "8px",
    },
    countValueUnit: {
      display: "flex",
      alignItems: "flex-end",
      paddingBottom: "16px",
    },
    countValue: {
      fontSize: "36px",
    },
    countUnit: {
      fontSize: "20px",
      opacity: "0.7",
      marginBottom: "8px",
      marginLeft: "8px",
    }
  })
);
export default useStyles;
