import { create, Whatsapp } from './Dependencies/Index.js'
import { TextSender } from './API_Utils.js'
import { DataBase } from './IA/Utils.js'
import { database } from './IA/DataKeeper.js'


/** TODO
 * O novo sistema vai utilizar uma função de client.onMessage assíncrona, com todas as funcionalidades
 * da IA retornando promises. Os awaits estarão dentro dos .then das promises e na função client
 */

const usersBank = new DataBase()

create({
    session: 'Bot-Matrícula', 
    multidevice: false 
}).then((client) => start(client)).catch((erro) => {
    console.log(erro);
});

function start(client) {
    client.onMessage(async (message) => {
        let num = message.from
        await TextSender.resolveMessages(num)
        if(TextSender.unvalidNumber(num))
            return
        if(num !== '559888470242@c.us')
            return
        try{
            let userOn = await usersBank.userRegister(num)
            if(userOn == 2){
                //await TextSender.delivText(usersBank.getWelcome(), num, client)
                return
            }
            if(userOn == 1){
                //let txt = await usersBank.users[num].chat.setDataOntoText(usersBank.users[num].chat.step.msgs)
                //await TextSender.delivText(['Retomando de onde paramos.', ...txt], num, client)
                return
            }
            if(await TextSender.notText(message, num, client))
                return
            //await TextSender.delivText((await usersBank.newMessage(message.body, num)), num, client)
        } catch(err){
            console.log(err)
        }
    });
}
