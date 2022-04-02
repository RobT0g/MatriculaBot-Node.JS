import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"

const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']


const fc = async function(){
    console.log((await db.request(`select * from registro where matricula = '10ab';`))[0])
}
fc(2)
