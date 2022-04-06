import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

//const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']
//let obj = {'a': 'abc', 'b': 'bc', 'c':'c'}

//let man = new ChatManager('2010')

const fc = async function(){
    console.log(await database.setDataOntoText(['~mat~, ~num~', '']))
}
fc(2)
