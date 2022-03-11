import { database } from "./DataKeeper.js"

const fc = async function(){
    await database.load()
    let conn = await database.database.connect()
    let data = await conn.query(`select * from extrainfo where tag = '~getmatriz~';`)
    console.log(data[0])
}
fc(2)


