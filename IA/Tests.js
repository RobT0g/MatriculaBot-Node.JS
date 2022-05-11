import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('12')
let msg = new Message('44')


async function test(){
    //await database.saveOnEffetivate('11', `insert into disc_fis values (default, "ENG2021", "10"), (default, "ENG2021", "11"),
    //    (default, "ENG2021", "2"), (default, "ENG2021", "3"), (default, "ENG2021", "80");`, {ids: ['10', '11', '2', '3', '80']})
    let a = (await fd.requests['~instmatseladd~']('559892437964@c.us')).split('.//')
    a.forEach(i => {
        console.log(i)
    })
    //console.log(a)
}
test()


