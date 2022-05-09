import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('10')
let msg = new Message('tira as matérias 10 e 310')


async function test(){
    let a = await tags.tagfunc['~invalmatd~'](msg, '10')
    console.log(a)
}
test()


