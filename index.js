const axios = require("axios");
const R = require("ramda");
const dayjs = require("dayjs");
const TelegramBot = require("node-telegram-bot-api");
const {
  toHHMMSS,
  sortByTime,
  getNameStation,
  getPlatformNumber
} = require("./helpers");

const { STATIONS, PIERS } = require("./stations");
const { TOKEN } = require("./token");

const options = { polling: true };
const bot = new TelegramBot(TOKEN, options);

STATIONS.map(station => {
  bot.onText(new RegExp(`/${station.command}`), msg => {
    const chatId = msg.chat.id;

    axios
      .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
      .then(({ data }) => {
        const dd = sortByTime(data);
        let output = "";

        dd.map(item => {
          if (R.any(R.equals(item.platformName))(station.platforms)) {
            const expectedArrival = dayjs(item.expectedArrival);
            const timeToArrival =
              dayjs() > expectedArrival
                ? "0:00"
                : expectedArrival.diff(dayjs(), "seconds");

            output += "```\n";
            output += getPlatformNumber(item.platformName);
            output += " | " + toHHMMSS(timeToArrival);
            output += " | " + getNameStation(item.destinationName);
            output += "\n```";
          }
        });

        if (output === "") {
          output = "No data";
        }

        bot.sendMessage(chatId, output, { parse_mode: "Markdown" });
      });
  });
});

PIERS.map(station => {
  bot.onText(new RegExp(`/${station.command}$`), msg => {
    const chatId = msg.chat.id;

    axios
      .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
      .then(({ data }) => {
        const dd = sortByTime(data);

        let output = "";

        dd.map(item => {
          if (R.any(R.equals(item.direction))(station.direction)) {
            const expectedArrival = dayjs(item.expectedArrival);
            let md;
            let liveTimeToArrival = expectedArrival.diff(dayjs(), "seconds");
            const timeToArrival =
              dayjs() > expectedArrival ? "0:00" : liveTimeToArrival;

            liveTimeToArrival <= station.timeToStation && (md = "~");
            liveTimeToArrival > station.timeToStation && (md = "_");
            liveTimeToArrival > station.timeToStation + 180 && (md = "");

            output = item.lineName;
            // output += " | " + item.direction;
            // output += " | " + dayjs(item.expectedArrival).format("HH:mm:ss");
            // output += " -> " + dayjs(item.timeToLive).format("HH:mm:ss");
            // output += " | " + toHHMMSS(item.timeToStation);
            output += " | " + md + toHHMMSS(timeToArrival) + md;

            output += " | " + getNameStation(item.destinationName);
            // output += " | " + dayjs().format("HH:mm:ss");
            // output += " | " + toHHMMSS(dayjs().diff(item.timestamp, "seconds"));
          }
        });

        if (output === "") {
          output = "No data";
        }

        bot.sendMessage(chatId, output, { parse_mode: "Markdown" });
      });
  });
});

bot.onText(/\/help/, msg => {
  const chatId = msg.chat.id;

  const stations = STATIONS.map(
    station => `/${station.command} - ${station.name}\nFilters: ${station.platforms.join(', ')}\n`
  ).join("\n");
  const piers = PIERS.map(
    station => `/${station.command} - ${station.name}\nFilters: ${station.direction.join(', ')}\n`
  ).join("\n");

  bot.sendMessage(chatId, `${stations}\n${piers}`);
});
