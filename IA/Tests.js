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
    //await test(15)
    //await test(15, 16, 20)
    await test(15, 14)
    await test(15, 14, 13)
    await test(15, 7)
    await test(15, 7, 3)
    await test(15, 60)
    await test(15, 61, 62)
    await test(15, 16, 20, 14, 13, 12, 7, 3, 4, 60, 61, 62)
})()
