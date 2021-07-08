import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    landing: {
      backgroundColor: "#ffffff",
      overflowX: "hidden",
      scrollBehavior: "smooth",
      [theme.breakpoints.down("sm")]: {
        width: "100vw",
      },
    },
    appbar: {
      background: theme.palette.primary.main,
      color: "#ffffff",
    },
    toolbar: {
      paddingLeft: "32px",
      paddingRight: "32px",
    },
    title: {
      flexGrow: 1,
      marginLeft: "32px",
      display: "flex",
      alignItems: "center",
    },
    navlink: {
      margin: "16px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    navlinkbtn: {
      margin: "16px",
      cursor: "pointer",
    },
    segment: {
      width: "100%",
      height: "100vh",
      [theme.breakpoints.down("xs")]: {
        height: "auto",
      },
    },
    greeter: {
      width: "100%",
      height: "90%",
      display: "flex",
    },
    gleft: {
      width: "600px",
      display: "flex",
      alignItems: "center",
    },
    content: {
      padding: "64px",
      marginTop: "-56px",
      [theme.breakpoints.down("xs")]: {
        padding: "12px",
        marginTop: "16px",
        textAlign: "center",
      },
    },
    appmaindesc: {
      fontSize: "80px",
      fontWeight: "bold",
      [theme.breakpoints.down("xs")]: {
        marginTop: "48px",
        fontSize: "40px",
      },
    },
    appdesc: {
      fontSize: "20px",
      lineHeight: 1.5,
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px",
        textAlign: "justify",
      },
    },
    demobutton: {
      marginTop: "18px",
      borderRadius: "30px",
      padding: "12px",
      paddingLeft: "24px",
      paddingRight: "24px",
      fontSize: "18px",
      backgroundColor: "#1a237e",
      color: "#ffffff",
    },
    gright: {
      flex: 1,
      backgroundImage: `url(${process.env.PUBLIC_URL}/landingbg.png)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      borderTopLeftRadius: "48px",
      borderBottomLeftRadius: "48px",
    },
    serviceseg: {
      height: "100%",
      width: "100%",
    },
    serviceslist: {
      marginTop: "64px",
      display: "flex",
      justifyContent: "space-evenly",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    card: {
      width: "300px",
      height: "350px",
      borderRadius: "16px",
      [theme.breakpoints.down("xs")]: {
        borderRadius: "0",
        width: "100%",
        marginTop: "8px",
      },
    },
    cardactionarea: {
      height: "100%",
    },
    cardmedia: {
      height: "150px",
      width: "150px",
    },
    servicename: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    aboutsseg: {
      height: "100%",
      width: "100%",
    },
    aboutstext: {
      fontSize: "24px",
      marginRight: "16px",
      marginBottom: "16px",
    },
    aboutusdesc: {
      fontSize: "18px",
      lineHeight: "1.5rem",
      marginBottom: "24px",
    },
    footer: {
      height: "90px",
      backgroundColor: theme.palette.primary.main,
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
    },
    footerdecor: {
      flex: 1,
      backgroundColor: theme.palette.secondary.main,
    },
    footercontent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "18px",
      [theme.breakpoints.down("xs")]: {
        textAlign: "center",
      },
    },
    aboutusmobile: {
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    bannerspace: {
      height: "48px",
      position: "relative",
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      animation: "$scrolltext 120s linear infinite",
      [theme.breakpoints.down("md")]: {
        width: "100%",
        overflowX: "scroll",
        animation: "none",
      },
    },
    bannercontent: {
      display: "inline",
      height: "48px",
      display: "flex",
      alignItems: "center",
      background: theme.palette.secondary.main,
    },
    "@keyframes scrolltext": {
      "0%": {
        transform: "translate(0, 0)",
      },
      "100%": {
        transform: "translate(-100%, 0)",
      },
    },
  })
);

export default useStyles;
