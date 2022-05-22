import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

async function test(){
    await db.load()
    await tags.actions['add_discs']({}, {tagInfo: ['', ['2', '7', '5']]}, '001')
    //await database.effetivate('001')
}

test()
