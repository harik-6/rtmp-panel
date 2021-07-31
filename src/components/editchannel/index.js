import React from "react";
import EditChannelAdmin from "./editchanneladmin";
// import EditChannelUser from "./editchanneluser";

const EditChannel = ({
  openForm,
  closeForm,
  successCallback,
  channel,
  user,
}) => {
  if (channel === null || user === null) return <></>;
  if (user["_id"] === process.env.REACT_APP_ADMINID) {
    return (
      <EditChannelAdmin
        openForm={openForm}
        closeForm={closeForm}
        successCallback={successCallback}
        channel={channel}
      />
    );
  }
  return <></>
};

export default EditChannel;
