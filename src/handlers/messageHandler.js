// src/handlers/messageHandler.js
const errorHandler = require('./errorHandler.js')
const fs = require('node:fs')
const path = require('node:path')

module.exports = async (message) => {
  try {
    const { channel, author } = message
    if (!author.bot) {
      // Specify the directory where your message content handlers are located
      const messagesPath = path.join(__dirname, '..', 'messages')

      // Read all files within the "messages" directory
      const handlerFiles = fs.readdirSync(messagesPath)

      // Iterate through and execute each message content handler
      for (const handlerFile of handlerFiles) {
        const handlerPath = path.join(messagesPath, handlerFile)
        const messageHandler = require(handlerPath)

        if (messageHandler && typeof messageHandler.data?.channelWord === 'string' && typeof messageHandler.run === 'function') {

          const regex = new RegExp(messageHandler['channelWord'], 'i')

          if (!regex.test(channel.name)) return

          // Execute the message content handler
          await messageHandler.run(message)
        } else {
          console.log(`[WARNING] No valid message content handler found in ${handlerPath}`)
        }
      }
    }
  } catch (error) {
    errorHandler(message, error)
  }
}

