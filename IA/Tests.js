import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"
import {validate} from '../Dependencies/Index.js'

let mes = new Message('O meu CPF é 61255627352')
console.log('asv'.match(/\d/))