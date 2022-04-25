import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

let cd = new ChatManager('2010')
async function test(){
    //await database.saveOnEffetivate('2010', `insert into user_ec values (default, "20210ENG", "20", "0"), (default, "20210ENG", "23", "0");`, {ids: ['20', '23']})
    //console.log(chat.steps[14])
    let msg = await cd.setDataOntoText(chat.steps[14].msgs)
    console.log('\n')
    for(let i in msg){
        console.log(msg[i] + '\n')
    }
}
test()