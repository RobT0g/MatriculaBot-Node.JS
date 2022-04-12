import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

const usersBank = new DataBase()
let num = '40028922'

let a = ['abc', 'abd', 'acf']
console.log(a.filter((i) => /abd/g.test(i)))

let man = {goTo: async (num) => {
    console.log(num)
}}
let obj = {actions: ['goTo10', 'goTo17']}

tags.handleAction(man, obj, '123456')

/*
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
    await fc('Eu sou de engenharia da computação')
    await fc('da turma de 2020')
    await fc('Agora sim')
}
main()
*/