import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('10')
let msg = new Message('minha mtrícula é 2020')


async function test(){
    let msg = await cd.setDataOntoText(chat.steps[15].msgs)
    for(let i in msg)
        console.log('----------------\n' + msg[i] + '\n----------------\n')
}
test()


