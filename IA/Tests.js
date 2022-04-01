import { database, db } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
let txt = 'abcdjnaisbafbianda'
console.log(txt.replaceAll('a', '0'), txt)
/*
const fc = async function(){
    let conn = await db.connect()
    console.log(await conn.query(`insert into cadastro (numero) values ('123');`))
}
fc(2)
*/