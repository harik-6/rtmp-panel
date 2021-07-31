import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    appmain: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down("md")]: {
        width: "100vw",
        overflowX: "hidden",
      },
    },
    grow: {
      flexGrow: 1,
      maxHeight: "52px",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    sidenav: {
      width: "200px",
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
      top: "0",
      bottom: "0",
      [theme.breakpoints.down("sm")]: {
        position: "absolute",
        zIndex: 1,
        height: "56px",
        width: "100%",
        overflowX: "scroll",
      },
    },
    routes: {
      flex: 1,
      overflow: "visible",
      scrollBehavior: "smooth",
      backgroundColor: "#ebe9e9",
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        width: "100vw",
        overflowX: "hidden",
        overflowY: "visible !important",
      },
    },
    navlist: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        display: "flex",
      },
    },
    mobilenav: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "4px",
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "row",
        overflowX: "scroll",
      },
    },
    navtextactive: {
      color: theme.palette.secondary.main,
      fontSize: "18px",
      opacity: "1",
    },
    navtext: {
      color: "#000000",
      fontSize: "18px",
      opacity: "0.3",
    },
    iconactive: {
      color: theme.palette.secondary.main,
      minWidth: "24px",
      marginRight: "8px",
      marginLeft: "8px",
      opacity: "1",
    },
    icon: {
      color: "#000000",
      minWidth: "24px",
      opacity: "0.3",
      marginRight: "8px",
      marginLeft: "8px",
    },
    appname: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#000000",
      fontSize: "24px",
      marginTop: theme.spacing(2),
      marginLeft: "16px",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        marginTop: "-52px",
      },
    },
    appbarroot: {
      flex: 1,
    },
    appbarmenubtn: {
      marginRight: theme.spacing(2),
    },
    appbartitle: {
      color: "#000000",
      flexGrow: 1,
      textTransform: "capitalize",
    },
    appbaravatar: {
      color: theme.palette.primary.main,
      background: "#ebe9e9"
    },
  })
);
export default useStyles;
