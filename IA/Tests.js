import { database } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
//console.log('abcdjnaisbafbianda'.replaceAll('a', '0'))
/*
const fc = async function(){
    await database.load()
    let conn = await database.connect()
    console.log((await conn.query(`select * from cadastro where numero = '10';`))[0])
}
fc(2)
*/
let words = '&wrd*wrd1&wrd2'.split(/[&]|[*]/g).slice(1)
let specs = '&wrd*wrd1&wrd2'.match(/[&]|[*]/g)
let obj = {pres: [], nonp: []}
words.forEach((i, k) => {
    if(specs[k] === '&')
        obj.pres.push(i)
    else
        obj.nonp.push(i)
})
console.log(obj)