import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

const usersBank = new DataBase()
let num = '559892437964@c.us'
/*
let a = ['abc', 'abd', 'acf']
console.log(a.filter((i) => /abd/g.test(i)))

let man = {goTo: async (num) => {
    console.log(num)
}}
let obj = {actions: ['goTo10', 'goTo17']}

tags.handleAction(man, obj, num)
*/

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
    console.log('--------------------------------------\n' + (await usersBank.newMessage(message, num)) + '\n--------------------------------------')
}

const main = async() => {
    await fc('Opaa')
    await fc('voltar')
    await fc('ok')/*
    await fc('pronto')
    await fc('mat123')
    await fc('rapaz')
    await fc('matriz curricular')
    await fc('revisar')
    await fc('rapaz')
    await fc('sim')*/
}
main()
