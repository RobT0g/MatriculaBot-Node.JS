import { database } from "./DataKeeper.js"
import { ChatManager } from "./ChatManager.js"
import { DataBase } from "./Utils.js"

const data = new DataBase()

const fc = async function(){
    await database.load()
    await data.userRegister('123654')
    console.log(await (data.newMessage('adicionar', 'chat', '123654')))
}
fc(2)
