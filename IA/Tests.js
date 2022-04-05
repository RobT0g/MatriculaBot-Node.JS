import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"

//const data = new DataBase()
//let txt = ['aqui tem ~mat~ e ~cpf~', 'aqui é só ~nome~', 'aqui é nada']
//let obj = {'a': 'abc', 'b': 'bc', 'c':'c'}

let man = new ChatManager('2010')

const fc = async function(){
    await man.move.goTo(0)
    console.log(await man.newMessage(new Message('Não')))
    console.log(await man.newMessage(new Message('Tá beleza então')))
    console.log(await man.newMessage(new Message('Posso ver a matriz curricular?')))
    console.log(await man.newMessage(new Message('Estou pronto, vamo em frente')))
    console.log(await man.newMessage(new Message('meu código de matrícula é 20201ENG')))
    console.log(await man.newMessage(new Message('Nao...')))
    console.log(await man.newMessage(new Message('meu código de matrícula é 20210ENG')))
    console.log(await man.newMessage(new Message('Agora sim')))
}
fc(2)
