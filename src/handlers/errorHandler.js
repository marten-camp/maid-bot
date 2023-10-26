module.exports = async (interaction, error) => {
    console.error(error)
    const reply_options = {
        content: '상호작용하는 동안 오류가 발생했습니다.',
        ephemeral: true
    }
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply_options)
    } else {
        await interaction.reply(reply_options)
    }
}