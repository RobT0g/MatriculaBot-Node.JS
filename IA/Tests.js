import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

async function test(){
    await db.load()
    let a = await fd.requests['~instmatseldel~']('19')
    a.split('.//').forEach(i => {console.log(i)})
}

test()
