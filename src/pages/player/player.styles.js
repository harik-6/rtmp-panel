import { makeStyles, createStyles } from "@material-ui/core/styles";

const player_width = 640 * 1.15;
const player_height = 360 * 1.15;
const useStyles = makeStyles((theme) =>
  createStyles({
    home: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    videoplayer: {
      height: player_height + "px",
      width: player_width + "px",
      backgroundColor: "#000000",
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
    iconlive: {
      color: "#32CD32",
      marginRight: "4px",
    },
    iconidle: {
      color: "red",
      marginRight: "4px",
    },
  })
);
export default useStyles;