import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    login: {
      height: "100%",
      width: "100%",
      display: "flex",
      overflow: "hidden",
      backgroundColor: "#050f66",
      padding: "48px",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        padding: "0",
        overflowX: "hidden",
      },
    },
    leftgrid: {
      flex: 1,
      display: "flex",
      backgroundImage: `url(${process.env.PUBLIC_URL}/landingbg.png)`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      borderTopLeftRadius: "20px",
      borderBottomLeftRadius: "20px",
      [theme.breakpoints.down("sm")]: {
        backgroundImage: "none",
      },
    },
    rightgrid: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderTopRightRadius: "20px",
      borderBottomRightRadius: "20px",
    },
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    welcomemsg: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      paddingTop: theme.spacing(2),
    },
    loginmessage: {
      textAlign: "center",
      fontSize: "14px",
      paddingBottom: theme.spacing(2),
    },
    loginbtn: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
    },
    txtcontainer: {
      marginLeft: "40px",
      marginTop: "32px",
      [theme.breakpoints.down("sm")]: {
        color: "#ffffff",
      },
    },
    maintxt: {
      fontSize: "40px",
      fontWeight: "bold",
      marginBottom: "8px",
      [theme.breakpoints.down("xs")]: {
        fontSize: "48px",
      },
    },
    subtxt: {
      fontSize: "18px",
      marginBottom: "8px",
    },
    preloadercnt: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    preloader: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(6),
    },
    eyeIcon: {
      color: "grey",
      cursor: "pointer",
    },
    loginform: {
      marginTop: "48px",
      padding: "32px",
    },
  })
);

export default useStyles;
