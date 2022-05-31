import { bot } from './Controller.js'
import { Client, Intents } from './Dependencies/Index.js'
import { TextSender } from './Discord/TextSender.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const token = "OTcyMTUxNjEwMTcwMDQ4NTYy.GpcBPE.yL7sQaBbbKiVVEW6MyhtGCjN4CdQyC0vWFZOiM"

client.on('ready', () => {
    client.user.setActivity('Estou esperando instruções.')
    console.log('Foi')
})

client.on('guildCreate', () => {
    client.user.setActivity('aaa')
})

client.on('guildDelete', () => {
    client.user.setActivity('bbb')
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return false; 
    if(message.content === "ativar"){
        bot.activate(message)
    } else if(message.content === "desativar"){
        bot.finish(message)
    }
});

client.login(token)

