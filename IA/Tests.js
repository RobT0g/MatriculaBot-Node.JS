import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Msgs.js"
import {validate} from '../Dependencies/Index.js'

console.log(tags.tagfunc['validarCPF']('61255627352'))

/* (async () => {
    await db.load()
    let a = await fd.requests['~instmatseladd~']('016')
    console.log('============================')
    console.log(a)
})() */