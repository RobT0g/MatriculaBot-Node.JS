import { create, Whatsapp, fs } from './Dependencies/Index.js'
import { TextSender } from './API_Utils.js'
import { DataBase } from './IA/Utils.js'
import { AutoQueue } from './ExecutionQueue.js'
import { db } from './IA/DataKeeper.js'

const usersBank = new DataBase()
const queue = new AutoQueue()

function start(client) {
    client.onMessage(async (message) => {
        let num = message.from
        console.log(num)
        if(TextSender.unvalidNumber(num) || num != '559888470242@c.us')
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
        this.logged = false
    }

    async activate(){
        if(this.logged && this.runing){
            return
        }        
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
            console.log(asciiQR)
        }, undefined, {multidevice: false, logQR: true})
        this.logged = true
        this.running = true
        start(this.client)
        this.alertAdm()
    }

    async alertAdm(){
        if(this.running)
            TextSender.delivText(['Estou Online!'], '559892437964@c.us', this.client)
    }

    async finish(){
        if(this.logged){
            await this.client.close()
        }
    }
}

const bot = new Bot()
export { bot }