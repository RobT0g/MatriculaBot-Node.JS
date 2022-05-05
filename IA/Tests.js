import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('559892437964@c.us')
let msg = new Message('minha mtrícula é 2020')


async function test(){
    let a = await cd.setDataOntoText(chat.steps[13].msgs)
    for(let i in a){
        console.log(a[i])
        console.log('---------------')
    }
}
test()