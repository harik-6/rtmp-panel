import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    users: {
      padding: theme.spacing(2),
      flex:1,
      backgroundColor:"#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
        marginTop: "48px",
      },
    },
    chcardcnt: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        width: "350px",
      },
    },
    paper: {
      height: "160px",
      padding: theme.spacing(1),
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
    paperhead: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: theme.spacing(3),
    },
    paperbody: {
      textAlign: "center",
      fontSize: "56px",
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
    },
    countHeader: {
      paddingBottom: "8px",
      paddingTop: "8px",
    },
    countValue: {
      fontSize: "48px",
      paddingBottom: "16px",
    },
  })
);
export default useStyles;