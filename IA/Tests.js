import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('10')
let msg = new Message('44')


async function test(){
    let a = await tags.tagfunc['~matnums~'](msg, '559892437964@c.us')
    console.log(a)
}
test()


