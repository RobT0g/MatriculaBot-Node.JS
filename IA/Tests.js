import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

async function test(...discs){
    await db.load()
    let a = await fd.requests['~instmatseldel~']('011', discs)
    a.split('.//').forEach(i => {console.log(i)})
    console.log('----------------------------------------------------------------------------------------------------')
}

(async () => {
    //7, 3, 4, 6
    await test(7)
    await test(7, 3)
    await test(7, 10)
    await test(7, 10, 11)
    await test(7, 3, 10, 11, 12)
})()
