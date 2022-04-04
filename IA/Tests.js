import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"

//const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']
let obj = {'a': 'abc', 'b': 'bc', 'c':'c'}

const fc = async function(){
    console.log(obj, 'b' in obj)
    delete obj['b']
    console.log(obj, 'b' in obj)
}
fc(2)
