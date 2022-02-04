import axios from "axios";

const getHealth = async (hlsUrl, user) => {
  try {
    await axios.get(hlsUrl);
    return true;
  } catch (error) {
    return false;
  }
};

export { getHealth };
