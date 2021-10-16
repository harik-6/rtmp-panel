import React from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import useStyles from "./landing.styles";

const allservices = [
  {
    name: "Live Streaming",
    image: "liveevents.png",
    desc: `We support you to stream your live events like Marriages,
     Corporate events and Church prayers etc.`,
  },
  {
    name: "TV Channel Distribution",
    image: "distribution.png",
    desc: `We support you to distribute your tv channel to different MSO with decoder boxes.`,
  },
  {
    name: "Website Development",
    image: "webapp.png",
    desc: `We develop web application and also develop static web pages.
    We also support in deploying the same and search engine optimization.`,
  },
  {
    name: "APK Development",
    image: "mobileapp.png",
    desc: `We develop mobile apk and support publishig it to playstore.
    Also hybrid technologies used based on user requirements.`,
  },
];

const Ourservices = () => {
  const classes = useStyles();
  return (
    <div className={classes.serviceseg}>
      <Typography
        style={{
          paddingTop: "48px",
          fontSize: "36px",
        }}
        variant="h6"
        align="center"
      >
        Our Services
      </Typography>
      <div className={classes.serviceslist}>
        {allservices.map((service) => (
          <FeatureCard key={service.name} data={service} />
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ data }) => {
  const classes = useStyles();
  return (
    <Card elevation={3} className={classes.card}>
      <CardActionArea className={classes.cardactionarea}>
        <CardContent>
          <p style={{ textAlign: "center", marginBottom: "16px" }}>
            <img
              alt={data.name}
              className={classes.cardmedia}
              src={data.image}
            />
          </p>
          <p className={classes.servicename}>{data.name}</p>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Ourservices;
