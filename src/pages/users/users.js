import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// components
import Preloader from "../../components/Preloader";
import UtilDiv from "../../components/Utildiv";
import Usercard from "./Usercard";
import CreateNewUser from "../../components/User/Createuser";
import Nodata from "../../components/Nodata";

// services
import {
  getAllUsers,
  deleteUser,
  promoteDemoteAdmin,
} from "../../service/user.service";
import Actions from "../../context/actions";
import { ButtonGroup, Stack } from "@mui/material";

// styled
const UsersListDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`;

const Users = () => {
  // store variabled
  const { store, dispatch } = useContext(AppContext);
  const { user } = store;

  // stat variabled
  const [_users, setUsers] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [_opencreate, setOpencreate] = useState(false);
  const [_sort, setSort] = useState("server");

  const _loadUsers = async () => {
    setLoading(true);
    let usrs = await getAllUsers(user);
    usrs.sort((a, b) => a.server.localeCompare(b.server));
    dispatch({
      type: Actions.SET_USER_LIST,
      payload: usrs,
    });
    setUsers(usrs);
    setLoading(false);
  };

  const _changeAdminStatus = async (_u) => {
    const us = await promoteDemoteAdmin(_u);
    if (us === "success") {
      _loadUsers();
    }
  };

  const _deleteUser = async (_u) => {
    setLoading(true);
    await deleteUser(user, _u);
    _loadUsers();
  };

  useEffect(() => {
    _loadUsers();
    //eslint-disable-next-line
  }, []);

  if (_loading) {
    return <Preloader message={"Loading users..."} />;
  }

  let sortedUsers = _users;
  if (_sort === "server") {
    sortedUsers.sort((a, b) => a.server.localeCompare(b.server));
  } else {
    sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
  }

  return (
    <div>
      <UtilDiv>
        <Stack direction="row" alignItems="center" spacing={2}>
          <p style={{ fontSize: "18px" }}>Sort by: </p>
          <ButtonGroup>
            <Button
              disableElevation
              size="small"
              variant={_sort === "server" ? "contained" : "outlined"}
              onClick={() => setSort("server")}
            >
              server
            </Button>
            <Button
              disableElevation
              size="small"
              variant={_sort === "user" ? "contained" : "outlined"}
              onClick={() => setSort("user")}
            >
              user
            </Button>
          </ButtonGroup>
        </Stack>
        <Button
          disableElevation
          sx={{ marginLeft: "16px" }}
          size="small"
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => setOpencreate(true)}
        >
          New User
        </Button>
      </UtilDiv>
      {_users.length === 0 ? (
        <Nodata message={"You have not created users yet."} />
      ) : (
        <UsersListDiv>
          {sortedUsers.map((u, index) => (
            <Usercard
              key={index + "-" + u.username}
              user={u}
              callback={() => _loadUsers()}
              onDelete={() => _deleteUser(u)}
              showAdmin={user.usertype === "s"}
              onChangeAdmin={() => _changeAdminStatus(u)}
            />
          ))}
        </UsersListDiv>
      )}

      <CreateNewUser
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={() => _loadUsers()}
      />
    </div>
  );
};

export default Users;
