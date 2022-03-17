import { database } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
console.log('abc; abc; abd;'.split(';'))
/*
const fc = async function(){
    await database.load()
    let conn = await database.connect()
    console.log((await conn.query('select * from disc_ec;'))[0])
}
fc(2)
*/