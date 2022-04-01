import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"

const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']

let tag = '&robson&nome!nao!quero'
let msg = new Message('Meu nome é robson')
let out = [...tag.split('!').slice(1)]
console.log(tags.getTag(tag, msg))


/*
const fc = async function(){
    //let data = fd.setTags(txt, {num: '559892437964@c.us', matAt: 0})
    console.log(await database.getUserRegister('10'))
}
fc(2)
*/