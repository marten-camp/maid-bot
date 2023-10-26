//src/messages/percentage/index.js
const getRandomInt = (min, max) => Math.floor(
  Math.random() * (max - Math.ceil(min))
) + Math.ceil(min)

module.exports = {
  data:{
    "channelWord": "확률",
  },
  async run(message) {
    const {content, channel } = message
    
    if (content.includes('확률')) {
        const value = getRandomInt(0, 101)
        const replacedContent = content.replace('?', '')
        let res = ''

        if (['나', '너', '내', '니'].some(element => replacedContent.includes(element))) {
            res += '그 확률은'
            res += ' '
            res += `${value}% 입니다.`
        } else {
            res += replacedContent
            res += ' '
            res += `${value}% 입니다.`
        }
        channel.send(res)
        return
    }
  }
}