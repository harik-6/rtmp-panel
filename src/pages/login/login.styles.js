import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    login: {
      height: "100%",
      width: "100%",
      backgroundImage: `url(${process.env.PUBLIC_URL}/bg2.jpg)`,
      overflowX: "hidden",
    },
    loginform: {
      height: "auto",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        margin: "24px",
      },
    },
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    welcomemsg: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      paddingTop: theme.spacing(3),
    },
    loginmessage: {
      textAlign: "center",
      fontSize: "14px",
      paddingBottom: theme.spacing(4),
    },
    loginbtn: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(6),
    },
    maintxt: {
      fontSize: "100px",
      color: "#ffffff",
      fontWeight: "bold",
      [theme.breakpoints.down("xs")]: {
        fontSize: "48px",
      },
    },
    subtxt: {
      fontSize: "18px",
      color: "#ffffff"
    },
    txtcnt: {
      padding: theme.spacing(6),
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
    gridContainer: {
      marginTop: "72px",
      marginLeft : "24px",
      [theme.breakpoints.down("xs")]: {
        marginTop: "-32px",
        marginLeft : "0",
      },
    },
  })
);

export default useStyles;
