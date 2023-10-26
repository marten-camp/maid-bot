const {REST, Routes, Collection} = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

module.exports = async ({client, token, clientId}) => {
    try {
        client.commands = new Collection()
        const commandArray = []

        const foldersPath = path.join(__dirname, '../', 'commands')
        const commandFolders = fs.readdirSync(foldersPath)
      
        for (const folder of commandFolders) {
          const commandsPath = path.join(foldersPath, folder)
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath)
            if ('data' in command && 'run' in command) {
              client.commands.set(command.data.name, command)
              commandArray.push(command.data.toJSON())
            } else {
              console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "run" property.`)
            }
          }
        }

        const rest = new REST('10').setToken(token)

        console.log(`Started refreshing ${commandArray.length} application (/) commands.`)

        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commandArray
        },)

        console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
        console.error(error)
    }
}
