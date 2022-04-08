import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

const usersBank = new DataBase()
let num = '40028922'

const fc = async function(message){
    let userOn = await usersBank.userRegister(num)
    if(userOn == 2){
        console.log(await usersBank.getWelcome())
        return
    }
    if(userOn == 1){
        let txt = await usersBank.users[num].chat.setDataOntoText(usersBank.users[num].chat.step.msgs, num)
        console.log(['Retomando de onde paramos.', ...txt])
        return
    }
    console.log(await usersBank.newMessage(message, num))
}

const main = async function(){
    await fc('Opaa')
    //await fc('Minha matrícula é 202036A')
    //await fc('Pronto!')
}
main()
