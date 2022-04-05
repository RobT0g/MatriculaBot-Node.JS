import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

//const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']
//let obj = {'a': 'abc', 'b': 'bc', 'c':'c'}

const fc = async function(){
    let a = new StepStuff([], [], [])
    console.log(Object.entries(a))
    //console.log(chat.steps[2].fulfill.getActions())
}
fc(2)
