const getApp = (location) => {
  if (location.includes("localhost")) {
    return {
      name: "LOCALHOST",
      phone: "+91 79040 37932",
    };
  }
  if (location.includes("streamwell")) {
    return {
      name: "STREAMWELL",
      phone: "+91 79040 37932",
    };
  }
  if (location.includes("iptelevision")) {
    return {
      name: "IPTELEVISION",
      phone: "+91 97154 42908",
    };
  }
  if (location.includes("teluguwebsolutions")) {
    return {
      name: "TELUGU WEB SOLUTIONS",
      phone: "+91 70757 57910",
    };
  }
  if (location.includes("sscloud7")) {
    return {
      name: "SSCLOUD7",
      phone: "+91 96009 69006",
    };
  }
  return {
    name: "STREAMWELL",
    phone: "+91 79040 37932",
  };
};
export { getApp };
