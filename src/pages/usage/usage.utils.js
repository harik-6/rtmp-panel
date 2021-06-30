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

const _xaxisFormat = (usagearr) => {
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
  return (usagearr || []).map(({ date }) => {
    const dateid = new Date(date);
    return months[dateid.getUTCMonth()] + " " + dateid.getUTCDate();
  }).slice(1);
};

const _totalConsumption = (arr) => {
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

const _averageConsumption = (dataarr) => {
  if (dataarr.length === 0) {
    return {
      avgInband: 0,
      avgOutBan: 0,
    };
  }
  let totalin = 0;
  let totalout = 0;
  dataarr.forEach(({ usage }) => {
    totalin = Math.max(totalin, usage.inbound);
    totalout = Math.max(totalout, usage.outbound);
  });
  return {
    avgInband: totalin,
    avgOutBand: totalout,
  };
};

const formatDataFormVizualisation = (usagearr) => {
  usagearr = usagearr || [];
  usagearr.sort((a, b) => new Date(a.date) - new Date(b.date));
  const consumptionmap = usagearr.map(
    (data) => parseFloat(data.usage.totalIn) + parseFloat(data.usage.totalOut)
  );
  const xaxislabels = _xaxisFormat(usagearr);
  let xaxisdata = [];
  for (let i = 1; i < consumptionmap.length; i++) {
    let diff = consumptionmap[i] - consumptionmap[i - 1];
    xaxisdata.push(parseFloat(diff.toFixed(2)));
  }
  let totalusage = _totalConsumption(consumptionmap);
  let totlaunit = "GB";
  const { avgInband, avgOutBand } = _averageConsumption(usagearr);
  if (totalusage > 1000) {
    totalusage /= 1000;
    totlaunit = "TB";
  }
  return {
    usageDataObj: {
      total: {
        value: totalusage.toFixed(2),
        unit: totlaunit,
      },
      inBand: {
        value: avgInband.toFixed(2),
        unit: "Mbps",
      },
      outBand: {
        value: avgOutBand.toFixed(2),
        unit: "Mbps",
      },
    },
    graphDataObj: {
      ...defaultConfiguration,
      xAxis: {
        categories: xaxislabels,
      },
      series: [
        {
          type: "area",
          showInLegend: false,
          name: "Usage",
          data: xaxisdata,
        },
      ],
    },
  };
};

const formatDataFormVizualisationAdmin = (usagearr) => {
  usagearr = usagearr || [];
  usagearr.sort((a, b) => new Date(a.date) - new Date(b.date));
  const intotalmap = usagearr.map((data) => parseFloat(data.usage.totalIn));
  const outtotalmap = usagearr.map((data) => parseFloat(data.usage.totalOut));
  const intotal = _totalConsumption(intotalmap);
  const outtotal = _totalConsumption(outtotalmap);
  const { avgInband, avgOutBand } = _averageConsumption(usagearr);
  return {
    usageDataObj: {
      total: {
        intotal: intotal.toFixed(3),
        outtotal: outtotal.toFixed(3),
      },
      inBand: {
        value: avgInband.toFixed(2),
      },
      outBand: {
        value: avgOutBand.toFixed(2),
      },
    },
  };
};

export { formatDataFormVizualisation, formatDataFormVizualisationAdmin };
