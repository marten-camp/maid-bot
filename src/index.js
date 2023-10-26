const dotenv = require('dotenv')
if (process.argv.includes('--dev')) {
    dotenv.config({path: '.env.dev'})
} else {
    dotenv.config({path: '.env'})
}

const {token, clientId} = process.env

const {Client, Events, GatewayIntentBits} = require('discord.js')

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const deployCommands = require('./helpers/deployCommands.js')
const interactionHandler = require('./handlers/interactionHandler.js')
const messageHandler = require('./handlers/messageHandler.js')

deployCommands({client, token, clientId})

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})
client.on(Events.MessageCreate, messageHandler)
client.on(Events.InteractionCreate, interactionHandler)
client.login(token)