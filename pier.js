const axios = require("axios");
const R = require("ramda");
const dayjs = require("dayjs");
const {
  toHHMMSS,
  sortByTime,
  getNameStation,
  getPlatformNumber
} = require("./helpers");

// 930GCAW Canary Wharf Pier
// 930GWRF Royal Wharf Pier

const stations = [
  {
    stopPoint: "930GCAW",
    name: "Canary Wharf Pier",
    destination: ["Woolwich Pier"]
  },
//   {
//     stopPoint: "930GWRF",
//     name: "Royal Wharf Pier",
//     destination: ["Westminster"]
//   }
];

stations.forEach(station => {
  axios
    .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
    .then(({ data }) => {
      const dd = sortByTime(data);
      let output = `\n## ${station.name}`;

      dd.map(item => {
        if (R.any(R.equals(item.destinationName))(station.destination)) {
          const expectedArrival = dayjs(item.expectedArrival);
          const timeToArrival =
            dayjs() > expectedArrival
              ? "0:00"
              : expectedArrival.diff(dayjs(), "seconds");

          output += "\n";
          output += item.lineName;
          output += " | " + dayjs(item.timestamp).format('HH:mm:ss');;
          output += " | " + dayjs(item.timeToLivedayjs).format('HH:mm:ss');;
          output += " | " + dayjs(item.expectedArrival).format('HH:mm:ss');;
          output += " | " + item.direction;
          output += " | " + toHHMMSS(item.timeToStation);
          output += " | " + toHHMMSS(timeToArrival);
          output += " | " + getNameStation(item.destinationName);
        }
      });

      console.log(output);
    });
});
