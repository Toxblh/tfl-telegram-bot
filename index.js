const axios = require('axios')
const R = require('ramda')
const dayjs = require('dayjs')
const TelegramBot = require('node-telegram-bot-api')
const { toHHMMSS, sortByTime, getNameStation } = require('./helpers')

const STATIONS = require('./stations')
const { TOKEN } = require('./token')

const options = { polling: true }
const bot = new TelegramBot(TOKEN, options)

STATIONS.map(station => {
  bot.onText(new RegExp(`/${station.command}`), msg => {
    const userId = msg.chat.id

    axios
      .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
      .then(({ data }) => {
        const dd = sortByTime(data)
        let output = ''

        dd.map(item => {
          if (R.any(R.equals(item.platformName))(station.platforms)) {
            const expectedArrival = dayjs(item.expectedArrival)

            output += item.platformName + '\n'
            output += getNameStation(item.destinationName)
            output += ' (' + toHHMMSS(expectedArrival.diff(dayjs(), 'seconds')) + ')'
            output += ' ' + expectedArrival.format('HH:mm:ss')
            output += '\n\n'
          }
        })

        bot.sendMessage(userId, output)
      })
  })
})
