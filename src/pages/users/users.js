import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import TickIcon from "@mui/icons-material/Check";
import NoTickIcon from "@mui/icons-material/ClearOutlined";

// components
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import CreateNewUser from "../../components/createuser";
import EditUser from "../../components/edituser";
import DeleteConfirmationDialog from "../../components/deletechannel";
import UtilDiv from "../../components/Utildiv";

// services
import userservice from "../../service/user.service";

// styled
const TableContainerStyled = styled(TableContainer)`
  background-color: #ffffff;
  border-radius: 16px;
`;

const TableCellStyled = styled(TableCell)`
  padding: 12px 0;
`;

const Users = () => {
  // store variabled
  const { store } = useContext(AppContext);
  const { user } = store;

  // stat variabled
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [activeUser, setActiveUser] = useState(null);
  const [_users, setUsers] = useState([]);
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

  const loadAllUsers = async () => {
    setLoading(true);
    const usrs = await userservice.getAllUsers(user);
    console.log(usrs);
    setUsers(usrs);
    setLoading(false);
  };

  const changeAdminStatus = async (usertochange) => {
    const us = await userservice.promoteDemoteAdmin(
      user,
      usertochange.admin,
      usertochange.token
    );
    if (us !== null) {
      loadAllUsers();
    }
  };

  const deleteUser = async () => {
    setDeleteConfirm(false);
    await userservice.deleteUser(user, activeUser);
    loadAllUsers();
  };

  const offSet = page * pageSize;
  let spliceddata = _users.slice(offSet, (page + 1) * pageSize);
  spliceddata.sort((a, b) => a.username.localeCompare(b.username));

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

  if (_users.length <= 0 && action !== "add") {
    return (
      <>
        <Nodataloader message={"You don't have any users.Create one"} />
      </>
    );
  }

  return (
    <div>
      <UtilDiv>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={_users.length}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Button
          sx={{ marginLeft: "16px" }}
          size="small"
          variant="contained"
          endIcon={<AddIcon />}
        >
          New User
        </Button>
      </UtilDiv>
      <React.Fragment>
        <TableContainerStyled>
          <Table aria-label="channel-list">
            <TableRow>
              <TableCellStyled align="left">S.No</TableCellStyled>
              <TableCellStyled align="left">Name</TableCellStyled>
              <TableCellStyled align="left">Server</TableCellStyled>
              <TableCellStyled align="left">Limit</TableCellStyled>
              {/* <TableCellStyled align="left">PlayUrl</TableCellStyled> */}
              <TableCellStyled align="left">Edit</TableCellStyled>
              <TableCellStyled align="left">Delete</TableCellStyled>
              {user.usertype === "s" && (
                <TableCellStyled align="left">Admin</TableCellStyled>
              )}
            </TableRow>
            <TableBody>
              {spliceddata.map((u, index) => {
                return (
                  <TableRow key={u.username + " " + index}>
                    <TableCellStyled align="left">{`${
                      offSet + index + 1
                    }.`}</TableCellStyled>
                    <TableCellStyled align="left">{u.username}</TableCellStyled>
                    <TableCellStyled align="left">{u.server}</TableCellStyled>
                    <TableCellStyled align="left">{u.limit}</TableCellStyled>
                    {/* <TableCellStyled  align="left">
                            {u.preview ? _TickIcon() : _NoTickIcon()}
                          </TableCellStyled> */}
                    <TableCellStyled align="left">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setActiveUser(u);
                          openActionDialog("edit");
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCellStyled>
                    <TableCellStyled align="left">
                      <IconButton
                        onClick={(event) => {
                          setActiveUser(u);
                          askConfirmation();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCellStyled>
                    {user.usertype === "s" && (
                      <TableCellStyled
                        onClick={() => {
                          changeAdminStatus(u);
                        }}
                        align="left"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {u.admin ? _TickIcon() : _NoTickIcon()}
                      </TableCellStyled>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainerStyled>
      </React.Fragment>
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
