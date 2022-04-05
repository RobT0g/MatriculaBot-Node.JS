import {chat} from './ChatFlow.js'
import {ChatManager} from './ChatManager.js'
import {database} from './DataKeeper.js'

//--------TODO--------//
/**
 *  
 */ 

class Message{              //Guarda utilidades da mensagem recebida
    constructor(str){
        this.msgbody = str
        this.filterMsg = str.replace('ç', 'c').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        this.wrds = this.filterMsg.toLowerCase().replace(/[^a-z]/g, ' ').split(' ')
            .reduce((acc, i)=>{(!i=='')?acc.push(i):null; return acc},[])
    }
}

class DataBase{                 //Guarda todos os usuários
    constructor(){
        this.users = {}
    }

    getWelcome(){
        return chat.getWelcome()
    }

    async userRegister(num){
        if(num in this.users) 
            return 0
        let user = await database.getUserInfo(num)
        if(user){
            this.users[num] = new User(num)
            await this.users[num].chat.move.goTo(user.talkat)
            return 1
        }
        this.users[num] = new User(num)
        await database.addUser(num)
        return 2
    }

    async newMessage(msg, num){
        let message = new Message(msg)
        return await this.users[num].chat.newMessage(message, num)
    }
}

class User{     //Guarda atributos sobre o usuário
    constructor(num){
        this.num = num
        this.chat = new ChatManager(num)
    }
}


export { Message, DataBase, User }