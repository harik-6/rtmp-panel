import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  IconButton,
  TablePagination,
} from "@material-ui/core";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import PlusIcon from "@material-ui/icons/AddRounded";
import EditIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "./users.styles";
import CreateNewUser from "../../components/createuser";
import EditUser from "../../components/edituser";
import DeleteConfirmationDialog from "../../components/deletechannel";

const Users = () => {
  const classes = useStyles();
  const { user, actions, allUsers } = useContext(AppContext);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [activeUser, setActiveUser] = useState(null);
  // loaders and errors
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);

  const openActionDialog = (action) => {
    setAction(action);
  };

  const closeActionDialog = () => {
    setAction(null);
    setActiveUser(null);
  };

  const askConfirmation = () => {
    setDeleteConfirm(true);
  };

  const handleChangePage = (event, pagenumber) => {
    setPage(pagenumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };

  const loadAllUsers = async (forceLoad) => {
    if (forceLoad || allUsers.length === 0) {
      setLoading(true);
      const userandsett = await userservice.getAllUsers(user);
      console.log(userandsett);
      actions.setAllUsers(userandsett.map(uands => uands.user));
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setDeleteConfirm(false);
    await userservice.deleteUser(user,activeUser);
    loadAllUsers(true);
  }

  const offSet = page * pageSize;
  const spliceddata = allUsers.slice(offSet, (page + 1) * pageSize);

  useEffect(() => {
    loadAllUsers();
    //eslint-disable-next-line
  }, []);

  return (
    <div className={classes.users}>
      {loading ? (
        <div className={classes.preloadercntloader}>
          <CircularProgress />
          <p className={classes.preloadertxtloader}>{"Loading users..."}</p>
        </div>
      ) : (
        <Grid className={classes.chcardcnt} container>
          <Grid item lg={12}>
            {allUsers.length <= 0 ? (
              <>
                <div className={classes.preloadercnt}>
                  <p className={classes.preloadertxt}>
                    You don't have any users.Create one
                  </p>
                </div>
              </>
            ) : (
              <React.Fragment>
                <TableContainer className={classes.tablecnt}>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 25]}
                    component="div"
                    count={allUsers.length}
                    rowsPerPage={pageSize}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  <Table aria-label="channel-list">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">S.No</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Server</TableCell>
                        <TableCell align="left">Limit</TableCell>
                        <TableCell align="left">{""}</TableCell>
                        <TableCell align="left">{""}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {spliceddata.map((user, index) => (
                        <TableRow key={user.username + " " + index}>
                          <TableCell
                            className={classes.tbcell}
                            align="left"
                          >{`${offSet + index + 1}.`}</TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {user.username}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {user.server}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {user.limit}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setActiveUser(user);
                                openActionDialog("edit");
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              onClick={(event) => {
                                setActiveUser(user);
                                askConfirmation();
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      )}
      <IconButton
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          background: "#121858",
        }}
        onClick={() => setAction("add")}
      >
        <PlusIcon style={{ color: "white", fontSize: "32px" }} />
      </IconButton>
      <CreateNewUser
        openForm={action === "add"}
        closeCreatepop={closeActionDialog}
        successCallback={() => loadAllUsers(true)}
      />
      {activeUser !== null && (
        <EditUser
          openForm={action === "edit"}
          closeCreatepop={closeActionDialog}
          successCallback={() => loadAllUsers(true)}
          userToEdit={activeUser}
        />
      )}
      {activeUser !== null && (
        <DeleteConfirmationDialog
          openForm={openDeleteConfirm}
          closeForm={() => setDeleteConfirm(false)}
          onDeleteYes={deleteUser}
          channel={{
            name: activeUser.username,
          }}
        />
      )}
    </div>
  );
};

export default Users;
