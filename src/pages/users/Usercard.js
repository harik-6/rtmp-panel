import React, { useState } from "react";
import styled from "styled-components";

// components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

// services
import { getAvatarColor } from "./usercolors";
import EditUser from "../../components/Edituser";
import WarningModal from "../../components/Warningmodal";

// styled
const Name = styled.p`
  font-size: 15px;
  margin-bottom: 4px;
`;

const Server = styled.p`
  opacity: 0.6;
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

const Usercard = ({ user, callback, onDelete }) => {
  const username = user?.username;

  // state variables
  const [_openedit, setOpenedit] = useState(false);
  const [_opendelete, setOpendelete] = useState(false);

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
              <Name>{username}</Name>
              <Server>{user?.server}</Server>
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
