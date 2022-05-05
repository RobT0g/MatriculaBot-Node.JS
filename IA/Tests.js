import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('559892437964@c.us')
let msg = new Message('minha mtrícula é 10abd')

async function test(){
    await cd.move.goTo(1)
    console.log((await cd.checkRecorrent(new Message('Quero revisar a matriz curricular.'))))
}
test()