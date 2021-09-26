import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
// import { getXmlData } from "../../service/rtmp.service";

const useStyles = makeStyles((theme) =>
  createStyles({
    stat: {
      flex: 1,
      minHeight: "100vh",
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
    },
  })
);

const Stat = () => {
  const classes = useStyles();


  return (
    <div className={classes.stat}>
      {/* <ServerSelect
        serverNames={[
          "iptelevision.in",
          "teluguwebsolutions.com",
          "sharsolution.in",
        ]}
        onSelect={_changeServer}
        selectedServer={selectedServer}
        labelVisible={false}
      /> */}
      <div
        style={{
          display : 'flex',
          flex:1,
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center'
        }}
      >
        <p>No data available.</p>
      </div>
    </div>
  );
};

export default Stat;
