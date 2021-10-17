const _getReadableFileSizeString = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [
    " Kbps",
    " Mbps",
    " Gbps",
    " Tbps",
    "Pbps",
    "Ebps",
    "Zbps",
    "Ybps",
  ];
  do {
    fileSizeInBytes = fileSizeInBytes / 1000;
    i++;
  } while (fileSizeInBytes > 1000);
  return Math.max(fileSizeInBytes, 0.1).toFixed(3) + byteUnits[i];
};

const _msToTime = (ms) => {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days";
};

const statFormatter = (list = []) => {
  let map = {};
  for (let i = 0; i < list.length; i++) {
    const meta = list[i];
    let { audioRate, inBytes, outBytes, totalIn, totalOut, upTime, videoRate } =
      meta;
    const videoRateRaw = videoRate;
    audioRate = _getReadableFileSizeString(audioRate);
    videoRate = _getReadableFileSizeString(videoRate);
    inBytes = _getReadableFileSizeString(inBytes);
    outBytes = _getReadableFileSizeString(outBytes);
    totalIn = _getReadableFileSizeString(totalIn);
    totalOut = _getReadableFileSizeString(totalOut);
    upTime = _msToTime(upTime);
    map[meta.channelName] = {
      audioRate,
      inBytes,
      outBytes,
      totalIn,
      totalOut,
      upTime,
      videoRate,
      videoRateRaw,
    };
  }
  return map;
};

export { statFormatter };
