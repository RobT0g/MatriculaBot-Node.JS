import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

async function test(){
    await db.request(`select * from cursos;`)
    let a = (await fd.requests['~relatorio~']('559892437964@c.us'))
    a.split('.//').forEach(i => {
        console.log('================================')
        console.log(i)
        console.log('================================')
    })
}
test()
