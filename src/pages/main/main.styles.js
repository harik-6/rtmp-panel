import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    appmain: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    grow: {
      flexGrow: 1,
      maxHeight: "52px",
    },
    appbar: {
      height: "52px",
      justifyContent:"center"
    },
    sidenav: {
      width: "200px",
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
      position: "fixed",
      top: "0",
      bottom: "0",
    },
    routes: {
      marginLeft: "200px",
      flex: 1,
      overflow: "visible",
      scrollBehavior: "smooth",
    },
    navlist: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(1),
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
    navbtn: {
      marginBottom: "8px",
    },
    appname: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#000000",
      fontSize: "24px",
      marginTop: theme.spacing(2),
      marginLeft:"-24px"
    },
  })
);
export default useStyles;