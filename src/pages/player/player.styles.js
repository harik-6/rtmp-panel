import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    home: {
      width: "100%",
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
        marginTop: "48px",
      },
    },
    videoplayer: {
      backgroundColor: "#000000",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("sm")]: {
        width: "98vw",
        flexDirection: "column",
      },
    },
    iconlive: {
      fontSize:"14px",
      marginRight: "4px",
      position: "absolute",
      display:"flex",
      alignItems:"center",
      color:"#ffffff",
      marginTop:"301px",
      marginLeft:"450px",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    rtmpinfo: {
      marginTop: theme.spacing(3),
    },
    urls: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    urlheader: {
      fontWeight: "bold",
    },
    urlvalue: {
      padding: "8px",
    },
    paper: {
      height: "auto",
      padding: theme.spacing(1),
      textOverflow: "wrap",
      display: "flex",
      justifyContent: "space-between",
    },
    actioncnt: {
      height: "48px",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    preloadercnt: {
      height: "700px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxt: { fontSize: "20px", marginTop: "16px" },
    avatar: {
      backgroundColor: "#121858",
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
      cursor: "pointer",
    },
    profilemenu: {
      marginTop: "32px",
      marginLeft: "-48px",
    },
    metadatacontainer: {
      flex: 1,
      padding: "16px",
      background: "#ffffff",
      marginLeft: "26px",
      marginRight: "26px",
      borderRadius: "8px",
    },
    innermetadatacontainer: {
      background: "#ffffff",
      height: "350px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
    carousel: {
      marginTop: "16px",
      marginBottom: "24px",
      maxWidth: "1166px",
    },
  })
);
export default useStyles;
