const STATIONS = [
  {
    name: "Poplar",
    command: "pop",
    stopPoint: "940GZZDLPOP",
    platforms: ["Platform 1"]
  },
  {
    name: "Ponton Dock",
    command: "pdk",
    stopPoint: "940GZZDLPDK",
    platforms: ["Platform 2"]
  },
  {
    name: "Canning Town",
    command: "cgt",
    stopPoint: "940GZZDLCGT",
    platforms: ["Platform 1", "Platform 3"]
  },
  {
    name: "Canary Wharf",
    command: "cw",
    stopPoint: "940GZZDLCAN",
    platforms: ["Platform 3"]
  },
  {
    name: "Canary Wharf Tube",
    command: "tcw",
    stopPoint: "940GZZLUCYF",
    platforms: ["Eastbound - Platform 2"]
  },
  {
    name: "Stratford central line",
    command: "stc",
    stopPoint: "940GZZLUSTD",
    platforms: ["Eastbound - Platform 6", "Westbound - Platform 3"]
  },
  {
    name: "Stratford dlr",
    command: "std",
    stopPoint: "940GZZDLSTD",
    platforms: ["4a", "4b"]
  },
  {
    name: "Leytonstone",
    command: "ley",
    stopPoint: "940GZZLULYS",
    platforms: [
      "Eastbound - Platform 3",
      "Westbound - Platform 1",
      "Westbound - Platform 2"
    ]
  },
  {
    name: "Westferry",
    command: "wfr",
    stopPoint: "940GZZDLWFE",
    platforms: ["Platform 1"]
  },
];

PIERS = [
  {
    stopPoint: "930GCAW",
    name: "Canary Wharf Pier",
    command: "pier_cw",
    direction: ["outbound"],
    timeToStation: 4.5 * 60, // 4:30
  },
  {
    stopPoint: "930GWRF",
    name: "Royal Wharf Pier",
    command: "pier_rw",
    direction: ["inbound"],
    timeToStation: 9 * 60, // 9:00
  }
]

module.exports = { STATIONS, PIERS };
