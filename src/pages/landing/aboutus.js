import React from "react";
import { Typography } from "@material-ui/core";
import useStyles from "./landing.styles";
import CallIcon from "@material-ui/icons/Call";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import EmailIcon from "@material-ui/icons/Email";

const Aboutus = () => {
  const classes = useStyles();
  const _openWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send/?phone=917904037932&text&app_absent=0",
      "_blank"
    );
  };
  const _openTelephone = () => {
    window.open("tel:7904037932", "_blank");
  };
  const _openEmail = () => {
    window.open(
      "mailto:streamiswell@gmail.com&subject=Streamwell enquiry - Reg",
      "_blank"
    );
  };
  return (
    <div className={classes.aboutsseg}>
      <Typography
        style={{
          fontSize: "36px",
        }}
        variant="h6"
        align="center"
      >
        Contact Us
      </Typography>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginLeft: "16px" }}>
          <p className={classes.aboutstext}>Questions or Comments</p>
          <p className={classes.aboutusdesc}>
            Let us know more about your project. We can customize our services
            into a package that fits your specific needs. Tell us more about
            your ideas, and we'll get back to you soon with some answers.
          </p>
          <CallIcon
            onClick={_openTelephone}
            fontSize="large"
            color="primary"
            style={{ marginRight: "8px", cursor: "pointer" }}
          />
          <WhatsAppIcon
            onClick={_openWhatsApp}
            fontSize="large"
            style={{ color: "#128C7E", marginRight: "8px", cursor: "pointer" }}
          />
          <EmailIcon
            onClick={_openEmail}
            fontSize="large"
            color="secondary"
            style={{ marginRight: "8px", cursor: "pointer" }}
          />
          <p
            className={classes.aboutusdesc}
            style={{
              marginTop: "24px",
            }}
          >
            StreamWell
          </p>
          <p className={classes.aboutusdesc}>
            TamilNadu,Andhra Pradhesh, Telangana and Karnataka
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <img width="500px" height="500px" src="aboutus.jpg" />
        </div>
      </div>
      <div className={classes.footer}>
        <p>Copyright © 2021 Stream Well - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Aboutus;
