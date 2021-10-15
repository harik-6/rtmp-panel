import React, { useState } from "react";
import styled from "styled-components";

// components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import TickIcon from "@mui/icons-material/CheckOutlined";
import CrossIcon from "@mui/icons-material/ClearOutlined";
import WarningModal from "../../components/Warningmodal";


// services
import { getAvatarColor } from "./usercolors";
import EditUser from "../../components/Edituser";
import Constants from "../../constants";

// styled
const Name = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Server = styled.p`
  opacity: 0.6;
  margin-bottom: 8px;
`;

const Limit = styled.p`
  opacity: 0.6;8
`;

const DataDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 8px;
`;

const ActionDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`;

const AdminDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

const AdminName = styled.p`
  font-size: 16px;
`;

const Usercard = ({ user, callback, onDelete, showAdmin, onChangeAdmin }) => {
  const username = user?.username;

  // state variables
  const [_openedit, setOpenedit] = useState(false);
  const [_opendelete, setOpendelete] = useState(false);

  const _renderName = () => {
    if (showAdmin) {
      if (user.admin) {
        return (
          <AdminDiv>
            <AdminName>{username} </AdminName>
            <TickIcon
              sx={{
                width: 18,
                height: 18,
                cursor: "pointer",
                color: "green",
              }}
              onClick={onChangeAdmin}
            />
          </AdminDiv>
        );
      }
      return (
        <AdminDiv>
          <AdminName>{username} </AdminName>
          <CrossIcon
            sx={{
              width: 18,
              height: 18,
              cursor: "pointer",
              color: "red",
            }}
            onClick={onChangeAdmin}
          />
        </AdminDiv>
      );
    }
    return <Name>{username} </Name>;
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: 275,
          margin: "8px 0",
          borderRadius: "12px",
          paddingBottom: "0",
        }}
      >
        <CardContent>
          <DataDiv>
            <Avatar sx={{ bgcolor: getAvatarColor() }}>
              {(username || "s")[0].toUpperCase()}
            </Avatar>
            <div>
              {_renderName()}
              <Server>{user?.server}</Server>
              <Limit>Channel limit : {user?.limit}</Limit>
            </div>
          </DataDiv>
          <ActionDiv>
            <EditIcon
              onClick={() => setOpenedit(true)}
              sx={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <DeleteIcon
              onClick={() => setOpendelete(true)}
              sx={{ width: 16, height: 16, cursor: "pointer" }}
            />
          </ActionDiv>
        </CardContent>
      </Card>
      <EditUser
        open={_openedit}
        onClose={() => setOpenedit(false)}
        userToEdit={user}
        callback={callback}
      />
      <WarningModal
        open={_opendelete}
        onClose={() => setOpendelete(false)}
        message={`You sure you want to delete ${user?.username} ?`}
        onYes={onDelete}
      />
    </>
  );
};

export default Usercard;
