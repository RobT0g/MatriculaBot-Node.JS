import { AutoQueue } from '../ExecutionQueue.js'
import { db } from '../IA/DataKeeper.js'
import { DataBase } from '../IA/Utils.js'
import { Client, GatewayIntentBits } from '../Dependencies/Index.js'
import { TextSender } from './TextSender.js'
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
const num = '020'
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
            //APAGA SE DER ERRO
            if(Number(usersBank.users[num].chat.talkat) == 14)
               num = `{Number(num)+1}`
            //ATÉ AQUI
            resolve(false)
        } catch(err){
            console.log(err)
            reject(err)
        }
    }), num)
});

db.request(`select token from discord;`).then(data => {
    console.log(data[0][0].token)
    client.login(data[0][0].token)
})
