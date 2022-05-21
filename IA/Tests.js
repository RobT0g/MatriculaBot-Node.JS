import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

async function test(){
    await db.load()
    console.log((await tags.getTag('~curso~', new Message('Tecnologia da construção de edifícios'), '001')))
    
}

test()
