import { db, fd, database} from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']

const fc = async function(){
    let data = fd.setTags(txt, {num: '559892437964@c.us', matAt: 0})
    console.log(data)
}
fc(2)
