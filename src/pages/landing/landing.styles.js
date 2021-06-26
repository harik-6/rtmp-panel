import { makeStyles, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) =>
  createStyles({
    landing: {
      backgroundColor: "#ffffff",
      overflowX: "hidden",
      scrollBehavior: "smooth",
    },
    appbar: {
      background: "#1a237e",
      color: "#ffffff",
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
      height: "110px",
      backgroundColor: "#1a237e",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

export default useStyles;
