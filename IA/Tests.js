import { database } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
//console.log('abcdjnaisbafbianda'.replaceAll('a', '0'))

const fc = async function(){
    await database.load()
    let conn = await database.connect()
    console.log((await conn.query(`select * from cadastro where numero = '10';`))[0])
}
fc(2)
