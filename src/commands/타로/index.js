const {SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders')
const fortune = require('./fortune.json')
const imageUrl = require('./imageurl.json')

const COMMAND_NAME = '타로'
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}

const callNickname = function (guild, user) {
    const member = guild.member
    return member
        ? member.displayName
        : user.username
}
const getTarotImage=(heading, number)=>{
    return imageUrl.arcana[heading?'upward': 'downward'][number]
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName(COMMAND_NAME)
        .setDescription('타로점'),
    run: async (interaction) => {
        const botProfile = {
          botName: interaction.client.user.displayName ?? "메이드",
          botAvatarURL: interaction.client.user.displayAvatarURL() ?? "https://i.imgur.com/AfFp7pu.png",
        }
        const {botName, botAvatarURL} = botProfile
        // Show the modal to the user
        const {guild, user} = interaction

        const arcana = fortune['arcana']
        const number = getRandomInt(0, 22)
        const heading = getRandomInt(0, 2) === 0
            ? true
            : false
        const once = arcana[number]
        const nickname = callNickname(guild, user)

        const tarotImage = getTarotImage(heading, number)

        const imageEmbed = new EmbedBuilder()
            .setImage(tarotImage)
            .setTitle('당신이 뽑은 카드는')
            .setAuthor({name: nickname, iconURL: user.avatarURL(), url: user.avatarURL()})
            .setDescription(
                `**${once.name}**. 방향은 **${heading
                    ? '정위치'
                    : '역위치'}**.`
            )
            .setTimestamp()
            .setFooter({text: botName, iconURL: botAvatarURL})

        const fortuneEmbed = new EmbedBuilder()
            .setTitle(once.name)
            .setAuthor({name: nickname, iconURL: user.avatarURL(), url: user.avatarURL()})
            .addFields({
                name: '요약',
                value: once.summary
            }, {
                name: '정방향은',
                value: once.upward
            }, {
                name: '역방향은',
                value: once.downward
            }, {
                name: '\u200B',
                value: '\u200B'
            }, {
                name: '연애운',
                value: once.meanings[0]
            }, {
                name: '직업운',
                value: once.meanings[1]
            }, {
                name: '금전운',
                value: once.meanings[2]
            }, {
                name: '성격운',
                value: once.meanings[3]
            }, {
                name: '기타운',
                value: once.meanings[4]
            },)
            .setTimestamp()
            .setFooter({text: botName, iconURL: botAvatarURL})

        await interaction.reply({
            embeds: [imageEmbed, fortuneEmbed]
        })
    }
}