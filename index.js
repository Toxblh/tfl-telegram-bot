const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')

const { TOKEN } = require('./token')

const options = { polling: true }
const bot = new TelegramBot(TOKEN, options)

function toHHMMSS(secs) {
  var sec_num = parseInt(secs, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = sec_num - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds}`
}

bot.onText(/\/pop/, msg => {
  const userId = msg.chat.id
  let output = ''
  axios.get('https://api.tfl.gov.uk/StopPoint/940GZZDLPOP/arrivals').then(({ data }) => {
    data.map(item => {
      if (item.platformName === 'Platform 1') {
        output += `${item.destinationName}\n${toHHMMSS(item.timeToStation)}\n\n`
      }
    })
    bot.sendMessage(userId, output)
  })
})

bot.onText(/\/pdk/, msg => {
  const userId = msg.chat.id
  let output = ''
  axios.get('https://api.tfl.gov.uk/StopPoint/940GZZDLPDK/arrivals').then(({ data }) => {
    data.map(item => {
      if (item.platformName === 'Platform 2') {
        output += `${item.destinationName}\n${toHHMMSS(item.timeToStation)}\n\n`
      }
    })
    bot.sendMessage(userId, output)
  })
})

bot.onText(/\/cgt/, msg => {
  const userId = msg.chat.id
  let output = ''
  axios.get('https://api.tfl.gov.uk/StopPoint/940GZZDLCGT/arrivals').then(({ data }) => {
    data.map(item => {
      if (item.platformName === 'Platform 1' || item.platformName === 'Platform 3' ) {
        output += `${item.platformName}\n${item.destinationName}\n${toHHMMSS(item.timeToStation)}\n\n`
      }
    })
    bot.sendMessage(userId, output)
  })
})