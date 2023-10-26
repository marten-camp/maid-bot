const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle } = require('discord.js')

//상수
const DIVISOR = 25 // 한 페이지에 표시되는 게임 개수. 최대 25
const COMMAND_NAME = 'gtag'

let max
let LAST_PAGE
let REMAINDER
let gameTagRoles=[]
let pages = []
let pageRow
let leftPage=DIVISOR
let currentPage
const roleFilter = (PermissionsBitField) => (role)=>{
    return role.color === 16735640 && !role.hoist && role.permissions.equals(new PermissionsBitField("0")) && !role.managed && role.mentionable
}
const getGameTagMenus=(interaction)=>{
  const {guild, member} = interaction
  const guildRoles = guild.roles.cache
  gameTagRoles = guildRoles.filter(roleFilter(PermissionsBitField))
  const gameTagMenus = gameTagRoles.map((tag)=>{
    return {
      label: tag.name,
      value: tag.id,
      default: false
    }
  })
  member.roles.cache.filter(roleFilter(PermissionsBitField))
        .forEach((myRole)=>{
          gameTagMenus.forEach((tag)=>{
            if(myRole.name === tag.label && myRole.id === tag.value){
              tag.default = true
            }
          })
        })
  return gameTagMenus
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('"선호하는 게임"의 태그를 선택해주세요.'),
  async run(interaction) {
    const gameTagMenus = getGameTagMenus(interaction)

    if(gameTagRoles.size < 1){
      await interaction.reply({ content: '불러올 게임 태그가 없습니다.', ephemeral: true })
      return
    }

    pages = []
    max = gameTagMenus.length < 126 ? gameTagMenus.length : 125
    LAST_PAGE = Math.ceil(max / DIVISOR)
    REMAINDER = max % DIVISOR

    for(let i = 1; i < LAST_PAGE+1; i++){
      pages.push(new ButtonBuilder()
          .setCustomId(`${COMMAND_NAME}:${i}`)
          .setLabel('Page '+i)
          .setStyle(ButtonStyle.Primary)
        )
    }

    currentPage = 1
    leftPage = DIVISOR
    if(currentPage === LAST_PAGE && REMAINDER > 0){
      leftPage = REMAINDER
    }

    pageRow = new ActionRowBuilder()
      .addComponents(...pages)

    const gameRow = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${COMMAND_NAME}:select${currentPage}`)
        .setPlaceholder(`Page${currentPage}`)
        .setMinValues(0)
        .setMaxValues(leftPage)
        .setOptions(...gameTagMenus.slice(0,leftPage))
    )
    interaction.commandName = COMMAND_NAME
    await interaction.reply({ content: '"선호하는 게임"의 태그를 선택해주세요.', components: [gameRow, pageRow] , ephemeral: true })
  },
  // interaction.isButton()
  async runButton(interaction){
    const gameTagMenus = getGameTagMenus(interaction)
    const { customId } = interaction
    const [commandName, action] = customId.split(':')
    currentPage = parseInt(action)
    if(currentPage === LAST_PAGE && REMAINDER > 0){
      leftPage = REMAINDER
    }else{
      leftPage = DIVISOR
    }
    const gameRow = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`${COMMAND_NAME}:select${currentPage}`)
          .setPlaceholder(`Page${currentPage}`)
          .setMinValues(0)
          .setMaxValues(leftPage)
          .setOptions(...gameTagMenus.slice((currentPage-1)*DIVISOR,(currentPage-1)*DIVISOR+leftPage))
      )
			await interaction.update({ content: '"선호하는 게임"의 태그를 선택해주세요.', components: [gameRow, pageRow], ephemeral: true })
  },
  // interaction.isStringSelectMenu()
  async runMenu(interaction){
    const gameTagMenus = getGameTagMenus(interaction)
    const { customId } = interaction
    const [commandName, action] = customId.split(':')
    if (action.startsWith('select')) {
      currentPage = parseInt(action.replace('select', ''))
      if(currentPage === LAST_PAGE && REMAINDER > 0){
        leftPage = REMAINDER
      }else{
        leftPage = DIVISOR
      }

      [...gameTagRoles].slice((currentPage-1)*DIVISOR,(currentPage-1)*DIVISOR+leftPage)
        .forEach((role, index)=>{
          if(interaction.values.includes(role[1].id)){
            interaction.member.roles.add(role[1])
            gameTagMenus[(currentPage-1)*DIVISOR+index].default = true
          }else{
            interaction.member.roles.remove(role[1])
            gameTagMenus[(currentPage-1)*DIVISOR+index].default = false
          }
        })

      const gameRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`${COMMAND_NAME}:select${currentPage}`)
            .setPlaceholder(`Page${currentPage}`)
            .setMinValues(0)
            .setMaxValues(leftPage)
            .setOptions(...gameTagMenus.slice((currentPage-1)*DIVISOR,(currentPage-1)*DIVISOR+leftPage))
        )
      
      interaction.commandName = COMMAND_NAME
      await interaction.update({ content: '"선호하는 게임"의 태그를 선택해주세요.', components: [gameRow, pageRow], ephemeral: true, commandName: COMMAND_NAME});
    }
  }
}