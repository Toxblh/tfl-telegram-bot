const axios = require('axios')
const R = require('ramda')
const dayjs = require('dayjs')
const TelegramBot = require('node-telegram-bot-api')
const { toHHMMSS, sortByTime, getNameStation, getPlatformNumber } = require('./helpers')

const STATIONS = require('./stations')
const { TOKEN } = require('./token')

const options = { polling: true }
const bot = new TelegramBot(TOKEN, options)

STATIONS.map(station => {
  bot.onText(new RegExp(`/${station.command}`), msg => {
    const chatId = msg.chat.id

    axios
      .get(`https://api.tfl.gov.uk/StopPoint/${station.stopPoint}/arrivals`)
      .then(({ data }) => {
        const dd = sortByTime(data)
        let output = ''

        dd.map(item => {
          if (R.any(R.equals(item.platformName))(station.platforms)) {
            const expectedArrival = dayjs(item.expectedArrival)
            const timeToArrival = dayjs() > expectedArrival ? '0:00' : expectedArrival.diff(dayjs(), 'seconds')

            output += '```\n'
            output += getPlatformNumber(item.platformName)
            output += ' | ' + toHHMMSS(timeToArrival)
            output += ' | ' + getNameStation(item.destinationName)
            output += '\n```'
          }
        })

        bot.sendMessage(chatId, output, { parse_mode: 'Markdown' })
      })
  })
})

bot.onText(/\/help/, msg => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, STATIONS.map(station => `/${station.command} - ${station.name}`).join('\n'))
})
