import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  IconButton,
  TablePagination,
} from "@material-ui/core";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import EditIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "./users.styles";
import CreateNewUser from "../../components/createuser";
import EditUser from "../../components/edituser";
import DeleteConfirmationDialog from "../../components/deletechannel";
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import FabAddButton from "../../components/fabaddbutton";
import TickIcon from "@material-ui/icons/Check";
import NoTickIcon from "@material-ui/icons/ClearOutlined";

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
      const users = await userservice.getAllUsers(user);
      console.log(users);
      actions.setAllUsers(users);
      setLoading(false);
    }
  };

  const changeAdminStatus = async (usertochange) => {
    const us = await userservice.promoteDemoteAdmin(
      user,
      usertochange.admin,
      usertochange.token
    );
    if (us !== null) {
      loadAllUsers(true);
    }
  };

  const deleteUser = async () => {
    setDeleteConfirm(false);
    await userservice.deleteUser(user, activeUser);
    loadAllUsers(true);
  };

  const offSet = page * pageSize;
  const spliceddata = allUsers.slice(offSet, (page + 1) * pageSize);

  const _TickIcon = () => (
    <TickIcon fontSize="small" style={{ color: "green" }} />
  );
  const _NoTickIcon = () => <NoTickIcon fontSize="small" color="secondary" />;

  useEffect(() => {
    loadAllUsers();
    //eslint-disable-next-line
  }, []);

  if (loading) {
    return <Preloader message={"Loading users..."} />;
  }

  if (allUsers.length <= 0 && action !== "add") {
    return (
      <>
        <Nodataloader message={"You don't have any users.Create one"} />
        <FabAddButton onClickAction={() => setAction("add")} />
      </>
    );
  }

  return (
    <div className={classes.users}>
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
                      <TableCell align="left">PlayUrl</TableCell>
                      <TableCell align="left">Edit</TableCell>
                      <TableCell align="left">Delete</TableCell>
                      {user.usertype === "s" && (
                        <TableCell align="left">Admin</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {spliceddata.map((u, index) => {
                      return (
                        <TableRow key={u.username + " " + index}>
                          <TableCell
                            className={classes.tbcell}
                            align="left"
                          >{`${offSet + index + 1}.`}</TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {u.username}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {u.server}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {u.limit}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {u.preview ? _TickIcon() : _NoTickIcon()}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setActiveUser(u);
                                openActionDialog("edit");
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              onClick={(event) => {
                                setActiveUser(u);
                                askConfirmation();
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          {user.usertype === "s" && (
                            <TableCell
                              onClick={() => {
                                changeAdminStatus(u);
                              }}
                              className={classes.tbcell}
                              align="left"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {u.admin? _TickIcon() : _NoTickIcon()}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
      <FabAddButton onClickAction={() => setAction("add")} />
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
