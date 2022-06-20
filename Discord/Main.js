import { AutoQueue } from '../ExecutionQueue.js'
import { db } from '../IA/DataKeeper.js'
import { DataBase } from '../IA/Utils.js'
import { Client, Intents } from '../Dependencies/Index.js'
import { TextSender } from './TextSender.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const num = '015'
const usersBank = new DataBase()
const queue = new AutoQueue()

client.on('ready', ()=>{
    client.user.setActivity('Bot Rematrícula.')
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
    await db.load()
    queue.enqueue(() => new Promise(async (resolve, reject) => {
        try{
            let userOn = await usersBank.userRegister(num)
            if(userOn == 2){
                await TextSender.delivText(usersBank.getWelcome(), message)
                resolve(false)
                return
            }
            if(userOn == 1){
                let txt = await usersBank.users[num].chat.setDataOntoText(usersBank.users[num].chat.step.msgs)
                await TextSender.delivText(['Retomando de onde paramos.', ...txt], message)
                resolve(false)
                return
            }
            await TextSender.delivText((await usersBank.newMessage(message.content, num)), message)
            resolve(false)
        } catch(err){
            console.log(err)
            reject(err)
        }
    }), num)
});

db.request(`select token from discord;`).then(data => {
    //console.log(data)
    client.login(data[0][0].token)
})
