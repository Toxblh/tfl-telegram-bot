const axios = require("axios");
const R = require("ramda");
const dayjs = require("dayjs");
const readline = require("readline");
const { toHHMMSS, sortByTime, getNameStation } = require("./helpers");
const chalk = require("chalk");

const stations = [
  {
    stopPoint: "930GCAW",
    name: "Canary Wharf Pier",
    direction: ["outbound"],
    timeToStation: 4.5 * 60, // 4:30
    info: []
  },
  {
    stopPoint: "930GWRF",
    name: "Royal Wharf Pier",
    direction: ["inbound"],
    timeToStation: 9 * 60, // 9:00
    info: []
  }
];

function updateData() {
  stations.forEach((station, index) => {
    axios
      .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
      .then(({ data }) => {
        const dd = sortByTime(data);

        stations[index].info = dd;
      });
  });
}

function printInfo() {
  const blank = "\n".repeat(process.stdout.rows);
  console.log(blank);
  readline.clearScreenDown(process.stdout);
  readline.cursorTo(process.stdout, 0, 0);

  stations.forEach(station => {
    console.log(`\n## ${station.name}`);

    station.info.map(item => {
      if (R.any(R.equals(item.direction))(station.direction)) {
        const expectedArrival = dayjs(item.expectedArrival);
        let color;
        let liveTimeToArrival = expectedArrival.diff(dayjs(), "seconds");
        const timeToArrival =
          dayjs() > expectedArrival ? "0:00" : liveTimeToArrival;

        liveTimeToArrival <= station.timeToStation && (color = chalk.red);
        liveTimeToArrival > station.timeToStation && (color = chalk.yellow);
        liveTimeToArrival > station.timeToStation + 180 &&
          (color = chalk.green);

        let output = item.lineName;
        // output += " | " + item.direction;
        output += " | " + dayjs(item.expectedArrival).format("HH:mm:ss");
        output += " -> " + dayjs(item.timeToLive).format("HH:mm:ss");
        output += " | " + toHHMMSS(item.timeToStation);
        output += " | " + color(toHHMMSS(timeToArrival));
        output += " | " + getNameStation(item.destinationName);
        // output += " | " + dayjs().format("HH:mm:ss");
        output += " | " + toHHMMSS(dayjs().diff(item.timestamp, "seconds"));
        console.log(output);
      }
    });
  });
}

const blank = "\n".repeat(process.stdout.rows);
console.log(blank);
readline.clearScreenDown(process.stdout);

setInterval(updateData, 5000);
setInterval(printInfo, 1000);
