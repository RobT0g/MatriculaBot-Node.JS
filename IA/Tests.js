import { database } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()
//console.log('abcdjnaisbafbianda'.replaceAll('a', '0'))

const fc = async function(){
    await database.load()
    await database.registerDiscs('123654', ['23', '14'], false)
    await database.effetivate('123654')
    await database.registerDiscs('123654', ['10', '35', '37', '41'], true)
    await database.effetivate('123654')
}
fc(2)
