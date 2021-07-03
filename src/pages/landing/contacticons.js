import React from "react";
import CallIcon from "@material-ui/icons/Call";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import EmailIcon from "@material-ui/icons/Email";

const ContactIcons = () => {
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
    <>
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
    </>
  );
};

export default ContactIcons;
