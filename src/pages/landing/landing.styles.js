import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    landing: {
      backgroundColor: "#ffffff",
      overflowX: "hidden",
    },
    appbar: {
      background: "#ffffff",
      color: "#000000",
    },
    toolbar: {
      paddingLeft: "32px",
      paddingRight: "32px",
    },
    title: {
      flexGrow: 1,
      marginLeft: "32px",
    },
    navlink: {
      margin: "16px",
      cursor: "pointer",
    },
    segment: {
      width: "100%",
      height: "100vh",
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
      marginTop: "-32px",
    },
    appdesc: {
      fontSize: "18px",
      lineHeight: 1.5,
    },
    demobutton: {
      marginTop: "18px",
      borderRadius: "20px",
      padding: "12px",
      fontSize: "18px",
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
    },
    card: {
      width: "300px",
      height: "350px",
      borderRadius: "16px",
    },
    cardactionarea: {
      height: "100%",
    },
    cardmedia: {
      height: "150px",
      width: "150px"
    },
    servicename: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
  })
);

export default useStyles;
