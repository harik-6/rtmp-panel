import React from "react";
import styled from "styled-components";

// components
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";


const ActionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom:8px;
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

const ChannelAction = ({ channel }) => {
  return (
    <ActionDiv>
      <div>
        <Name>{channel?.name}</Name>
        <Server>{channel?.server}</Server>
      </div>
      <Div>
        <Action>
          <EditIcon />
          <p>Edit</p>
        </Action>
        <Action>
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
    </ActionDiv>
  );
};

export default ChannelAction;
