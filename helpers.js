const R = require('ramda')

function toHHMMSS(secs) {
  var sec_num = parseInt(secs, 10)
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

var sortByTime = R.sortBy(R.prop('timeToStation'))

function getNameStation(value) {
  return value.replace(' DLR Station', '')
}

module.exports = {
  toHHMMSS,
  sortByTime,
  getNameStation
}
