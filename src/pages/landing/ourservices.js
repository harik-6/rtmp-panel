import React from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import useStyles from "./landing.styles";

const allservices = [
  {
    name: "Live Streaming",
    image: "liveevents.png",
    desc: `Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctic`,
  },
  {
    name: "Channel Distribution",
    image: "distribution.png",
    desc: `Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctic`,
  },
  {
    name: "Mobile Development",
    image: "mobileapp.png",
    desc: `Lizards are a widespread group of squamate reptiles, with over 6,000
        species, ranging across all continents except Antarctic`,
  },
  {
    name: "Web Development",
    image: "webapp.png",
    desc: `Lizards are a widespread group of squamate reptiles, with over 6,000
        species, ranging across all continents except Antarctic`,
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
          <FeatureCard data={service} />
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
            <img className={classes.cardmedia} src={data.image} />
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
