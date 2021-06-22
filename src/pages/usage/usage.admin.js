import React, { useContext, useEffect } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import Preloader from "../../components/preloader";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import AppContext from "../../context/context";
const useStyles = makeStyles((theme) =>
  createStyles({
    channelsadmin: {
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
        marginTop: "48px",
      },
    },
    tablecnt: {
      marginTop: theme.spacing(3),
      backgroundColor: "#FFFFFF",
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down("sm")]: {
        width: "350px",
        zIndex: 999,
      },
    },
    tbcell: {
      paddingTop: "4px",
      paddingBottom: "4px",
    },
  })
);

const UsageAdmin = () => {
  const { allUsers } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [usagelist, setUsageList] = useState([]);

  const formatVizData = (mapdata) => {
    const fulllist = mapdata.map(
      (datapoint) => formatDataFormVizualisation(datapoint).usageDataObj
    );
    setUsageList(fulllist);
  };

  const loadUsageData = async () => {
    setLoading(true);
    let alldata = [];
    allUsers.forEach(async (userAndSett) => {
      const tempdata = await userservice.getUsageData(userAndSett);
      alldata.push(tempdata);
    });
    formatVizData(alldata);
    setLoading(false);
  };

  useEffect(() => {
    loadUsageData();
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  if (loading) {
    return <Preloader message={"Loading data..."} />;
  }
  return (
    <div className={classes.channelsadmin}>
      <TableContainer className={classes.tablecnt}>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Hls</TableCell>
          </TableRow>
          <TableBody>
            {usagelist.map((channel, index) => (
              <TableRow key={channel.key + " " + index}>
                <TableCell className={classes.tbcell} align="left">
                  {channel.name}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {channel.httpLink}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsageAdmin;
