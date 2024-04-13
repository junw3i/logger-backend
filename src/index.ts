import winston, { format } from 'winston'
import WsTransport from './wsTransport'

const logFormat = format.printf(({ label, level, message, timestamp }) => {
  return `${timestamp} ${label} ${level} ${message}`
})

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format((info) => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    // format.colorize(),
    format.simple(),
    logFormat
  ),
  level: 'info',
  transports: [new winston.transports.Console(), new WsTransport({})],
})

setInterval(() => {
  logger.log({
    level: 'info',
    message: 'Hello distributed log files!',
    label: 'MOCKER',
  })
}, 3000)
