import { create, Whatsapp, fs } from './Dependencies/Index.js'
import { TextSender } from './API_Utils.js'
import { DataBase } from './IA/Utils.js'
import { AutoQueue } from './ExecutionQueue.js'
import { db } from './IA/DataKeeper.js'

const usersBank = new DataBase()
const queue = new AutoQueue()

/*
create({
    session: 'Bot-Matrícula', 
    multidevice: false 
}).then((client) => start(client)).catch((erro) => {
    console.log(erro);
});*/

function start(client) {
    client.onMessage(async (message) => {
        let num = message.from
        if(TextSender.unvalidNumber(num))
            return
        await db.load()
        queue.warnUser(num, client)
        queue.enqueue(() => new Promise(async (resolve, reject) => {
            try{
                let userOn = await usersBank.userRegister(num)
                if(userOn == 2){
                    await TextSender.delivText(usersBank.getWelcome(), num, client)
                    resolve(false)
                    return
                }
                if(userOn == 1){
                    let txt = await usersBank.users[num].chat.setDataOntoText(usersBank.users[num].chat.step.msgs)
                    await TextSender.delivText(['Retomando de onde paramos.', ...txt], num, client)
                    resolve(false)
                    return
                }
                if(await TextSender.notText(message, num, client)){
                    resolve(false)
                    return
                }
                await TextSender.delivText((await usersBank.newMessage(message.body, num)), num, client)
                resolve(false)
            } catch(err){
                console.log(err)
                reject(err)
            }
        }), num)
    });
}

class Bot{
    constructor(){
        this.running = false
    }

    async activate(contact, message){
        if(!this.running){
            this.client = await create('Matricula-bot', (base64Qr, asciiQR, attempts, urlCode) => {
                var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};
                if (matches.length !== 3) {
                    return new Error('Invalid input string');
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');
                var imageBuffer = response;
                fs.writeFile('out.png', imageBuffer['data'], 'binary', function (err) {
                    if (err != null) {
                      console.log(err);
                    }
                });
                message.channel.send({files: [{
                    attachment: 'out.png',
                    name: 'out.png',
                    description: 'A description of the file'
                  }]})
            }, undefined, { logQR: false })
            this.running = true
        }
    }

    async alertAdm(){
        if(this.running)
            TextSender.delivText(['Estou Online!'], '559892437964@c.us', this.client)
    }
}

const bot = new Bot()
export { bot }