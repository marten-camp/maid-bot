const errorHandler = require('./errorHandler.js')
module.exports = async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName)

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
      }

      await command.run(interaction)
      return
    }
    if(interaction.isStringSelectMenu()){
      const { customId } = interaction
      const [commandName, action] = customId.split(':')

      const command = interaction.client.commands.get(commandName)
      await command.runMenu(interaction)
      return
    }

    if (interaction.isButton()) {
      const { customId } = interaction
      const [commandName, action] = customId.split(':')

      const command = interaction.client.commands.get(commandName)
      await command.runButton(interaction)
      return
    }
  } catch (error) {
    errorHandler(interaction, error)
  }
}