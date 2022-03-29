import { database, db } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
//console.log('abcdjnaisbafbianda'.replaceAll('a', '0'))

const fc = async function(){
    let conn = await db.connect()
    console.log(await conn.query(`insert into cadastro (numero) values ('123');`))
}
fc(2)
