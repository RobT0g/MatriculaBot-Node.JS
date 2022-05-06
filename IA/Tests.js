import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('559892437964@c.us')
let msg = new Message('minha mtrícula é 2020')


async function test(){
    tags.actions['add_discs']({}, {tagInfo: [1, [1, 2, 3, 4]]})
}
test()


