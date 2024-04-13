import Transport, { TransportStreamOptions } from 'winston-transport'
import WebSocket from 'ws'

interface LogData {
  level: string
  message: string
  meta: any
}

class WsTransport extends Transport {
  wss: WebSocket.Server
  constructor(options: TransportStreamOptions) {
    super(options)
    this.wss = new WebSocket.Server({ port: 8080 })
    console.log('WebSocket server running on port 8080')

    // Event listener for when a client connects
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected')

      // Event listener for messages received from clients
      ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`)

        // Echo the message back to the client
        // ws.send(`Echo: ${message}`)
      })

      // Event listener for when a client disconnects
      ws.on('close', () => {
        console.log('Client disconnected')
      })
    })
  }

  log(info: LogData, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info)
    })
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(info))
      }
    })
    callback()
  }
}

export default WsTransport
