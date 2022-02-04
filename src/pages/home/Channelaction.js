import React, { useState } from "react";
import styled from "styled-components";

// components
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Legend from "../../components/Legend";
import WarningModal from "../../components/Warningmodal";
import EditChannel from "../../components/Channel/Editchannel";

// services
import { deleteChannel } from "../../service/channel.service";
import { changeRtmpStatus } from "../../service/rtmp.service";
import { rebootServer } from "../../service/server.service";

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
  const [_toEdit, setToEdit] = useState(channel);

  const _rebootAndCallback = async () => {
    await rebootServer(_toEdit.server);
    callback();
  };

  const _deleteChannel = async () => {
    await deleteChannel(_toEdit["id"]);
    _rebootAndCallback();
  };

  const _onOffChannel = async (_) => {
    await changeRtmpStatus(_toEdit, user);
    _rebootAndCallback();
  };

  React.useEffect(() => {
    setToEdit(channel);
  }, [channel]);

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
          <Action onClick={() => setOpenedit(true)}>
            <EditIcon />
            <p>Edit</p>
          </Action>
        )}
        <Action onClick={() => setOpendelete(true)}>
          <DeleteIcon />
          <p>Delete</p>
        </Action>
        {user.usertype === "s" && (
          <Action>
          <FormControlLabel
            control={
              <Switch
                onChange={_onOffChannel}
                size="small"
                checked={_toEdit.status}
              />
            }
            label={_toEdit.status ? "On" : "Off"}
          />
        </Action>
        )}
      </Div>
      <WarningModal
        open={_opendelete}
        onClose={() => setOpendelete(false)}
        message={`Are you sure you want to delete the channel ${channel?.name} ?`}
        onYes={_deleteChannel}
      />
      <EditChannel
        open={_openedit}
        onClose={() => setOpenedit(false)}
        callback={callback}
        channel={_toEdit}
      />
    </ActionDiv>
  );
};

export default ChannelAction;
