const fs = require('fs')
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders')

const readme = fs.readFileSync('README.md').toString()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('도움')
    .setDescription('도움말'),
  async run(interaction) {
    await interaction.reply({
      content: codeBlock(readme),
      ephemeral: true
    })
  }
}