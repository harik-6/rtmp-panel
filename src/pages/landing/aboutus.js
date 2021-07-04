import React from "react";
import { Typography } from "@material-ui/core";
import useStyles from "./landing.styles";
import ContactIcons from "./contacticons";
const Aboutus = () => {
  const classes = useStyles();
  return (
    <div className={classes.aboutsseg}>
      <Typography
        style={{
          fontSize: "36px",
          paddingBottom: "24px",
        }}
        variant="h6"
        align="center"
      >
        Contact Us
      </Typography>
      <div className={classes.aboutusmobile} style={{ display: "flex" }}>
        <div style={{ flex: 1, marginLeft: "16px" }}>
          <p className={classes.aboutstext}>Questions or Comments</p>
          <p className={classes.aboutusdesc}>
            Let us know more about your project. We can customize our services
            into a package that fits your specific needs. Tell us more about
            your ideas, and we will get back to you soon with some answers.
          </p>
          <ContactIcons />
          <p
            className={classes.aboutusdesc}
            style={{
              marginTop: "24px",
            }}
          >
            StreamWell
          </p>
          <p className={classes.aboutusdesc}>+91 79040 37932</p>
          <p className={classes.aboutusdesc}>
            Tamilnadu, Andhra Pradhesh, Telangana and Karnataka
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <img
            alt="Contact Us"
            width="500px"
            height="500px"
            src="aboutus.jpg"
          />
        </div>
      </div>
      <div className={classes.footer}>
        <p className={classes.footerdecor} />
        <p className={classes.footercontent}>
          Copyright © 2021 StreamWell - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
