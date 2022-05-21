import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"

function setTo10(obj){
    obj.num = 10
}

class Num{
    constructor(num){
        this.num = num
    }

    update(){
        setTo10(this)
    }
}

let n = new Num(11)
console.log(n)
n.update()
console.log(n)

async function test(){
    
}
//test()
