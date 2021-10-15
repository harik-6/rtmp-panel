import React, { useState } from "react";
import styled from "styled-components";

// components
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Legend from "../../components/Legend";
import WarningModal from "../../components/Warningmodal";

// services
import { deleteChannel } from '../../service/channel.service';
import { rebootServer } from '../../service/rtmp.service';

const ActionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 32px;
  gap: 16px;
  padding-right: 16px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Server = styled.p`
  font-size: 16px;
  opacity: 0.6;
`;

const ChannelAction = ({ channel, health, user, callback }) => {
  // state variables
  const [_openedit, setOpenedit] = useState(false);
  const [_opendelete, setOpendelete] = useState(false);

  const _deleteChannel = async () => {
    await deleteChannel(channel, user);
    await rebootServer([channel]);
    callback();
  };

  return (
    <ActionDiv>
      <div>
        <Name>{channel?.name}</Name>
        <Server>{channel?.server}</Server>
      </div>
      <Div>
        <Action>
          <Legend type={health ? "live" : "idle"} />
          <p>{health ? "Live" : "Idle"}</p>
        </Action>
        {user.usertype === "s" && (
          <Action>
            <EditIcon />
            <p>Edit</p>
          </Action>
        )}
        <Action onClick={() => setOpendelete(true)}>
          <DeleteIcon />
          <p>Delete</p>
        </Action>
        <Action>
          <FormControlLabel
            control={<Switch size="small" defaultChecked />}
            label="On"
          />
        </Action>
      </Div>
      <WarningModal
        open={_opendelete}
        onClose={() => setOpendelete(false)}
        message={`You sure you want to delete ${channel?.name} ?`}
        onYes={_deleteChannel}
      />
    </ActionDiv>
  );
};

export default ChannelAction;
