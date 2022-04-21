import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

console.log('abcd'.match(/\d+/g))

async function test(){
    //console.log(chat.steps[14])
    let msg = await database.setDataOntoText(chat.steps[14].msgs, '2010')
    console.log('\n')
    for(let i in msg){
        console.log(msg[i] + '\n')
    }
}
test()