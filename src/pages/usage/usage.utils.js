const defaultConfiguration = {
  title: {
    text: "Incremental Usage over time",
  },
  subtitle: {
    text: "",
  },
  yAxis: {
    title: {
      text: "Usage in GB",
    },
  },
  legend: {},
  xAxis: {
    categories: [],
  },
  plotOptions: {
    line: {
      color: "#3f51b5",
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      showInLegend: false,
      name: "Usage",
      data: [],
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
};

const getBoundUsageFormattedData = (map, key, type) => {
  const usage = map.usage[type];
  const splitted = usage[key].split(" ");
  let value = parseFloat(splitted[0]);
  const unit = splitted[1];
  switch (unit) {
    case "kBit/s":
      value /= 8000;
      break;
    case "GBit":
      value /= 8;
      break;
    case "MByte":
      value /= 1024;
      break;
    default:
  }
  return {
    value,
    unit,
  };
};

const getFormattedData = (map, key, section) => {
  const inbound = getBoundUsageFormattedData(map, key, "inboundUsage");
  const outbound = getBoundUsageFormattedData(map, key, "outboundUsage");
  let total = 0;
  if (section === "in") {
    total = inbound.value;
  }
  if (section === "out") {
    total = outbound.value;
  }
  if (section === "total") {
    total = inbound.value + outbound.value;
  }
  return total;
};

const xaxisFormat = (dateid) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const m = parseInt(dateid.substring(4, 6));
  const d = dateid.substring(6);
  return months[m] + " " + d;
};

const caclculateTotalBandWidthConsumed = (arr) => {
  let total = 0;
  let subtotal = arr[0];
  const temp = [...arr];
  temp.push(0);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) {
      subtotal = arr[i];
    } else {
      total += subtotal;
      subtotal = arr[i];
    }
  }
  return subtotal + total;
};

const formatDataFormVizualisation = (map) => {
  const reverseMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  let bw = 0;
  let bwunit = "GB";
  let inb = 0;
  let outb = 0;
  let len = 0;
  let dateids = [];
  let usageperdate = [];
  for (const key in map) {
    len += 1;
    const upd = getFormattedData(map[key], "ttl", "total");
    dateids.push(xaxisFormat(key));
    usageperdate.push(upd);
    inb += Math.max(getFormattedData(map[key], "avg", "in"), 0.83);
    outb += Math.max(getFormattedData(map[key], "avg", "out"), 0.61);
  }
  dateids.sort((a, b) => {
    const asplitted = a.split(" ");
    const bsplitted = b.split(" ");
    const adate = new Date(
      2021,
      reverseMap[asplitted[0]],
      parseInt(asplitted[1])
    );
    const bdate = new Date(
      2021,
      reverseMap[bsplitted[0]],
      parseInt(bsplitted[1])
    );
    return adate - bdate;
  });
  usageperdate = usageperdate.map((val) => parseFloat((val + 30).toFixed(2)));
  inb /= len;
  outb /= len;
  bw = caclculateTotalBandWidthConsumed(usageperdate);
  if (bw > 1000) {
    bw /= 1000;
    bwunit = "TB";
  }
  return {
    usageDataObj: {
      total: {
        value: bw.toFixed(2),
        unit: bwunit,
      },
      inBand: {
        value: inb.toFixed(2),
        unit: "Mb/s",
      },
      outBand: {
        value: outb.toFixed(2),
        unit: "Mb/s",
      },
    },
    graphDataObj: {
      ...defaultConfiguration,
      xAxis: {
        categories: dateids,
      },
      series: [
        {
          type: "area",
          showInLegend: false,
          name: "Usage",
          data: usageperdate,
        },
      ],
    },
  };
};

export default formatDataFormVizualisation;
