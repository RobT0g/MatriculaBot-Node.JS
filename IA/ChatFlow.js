import {textkeep, defaultans, defdef, messages, recorrent} from './Messages.js'

//--------TODO--------//
/**
 *  
 */ 

class ChatFlow{     //Guarda todo o fluxo
    constructor(recorrent){
        this.steps = []
        this.defdef = defdef
        this.recorrent = recorrent
    }

    /**
     * @param {ChatStep} st
     */
    set newStep(st){   //Dada a organzanização das mensagens atual, é melhor os blocos irem um a um
        st.regId = this.steps.length
        this.steps.push(st)
    }

    getWelcome(){
        return this.steps[0].msgs
    }

    //============= Funções de Localização =============//
    currentStep(id){
        return this.steps[id]
    }

    nextStepId(id, opt=0){
        try{
            let st = this.currentStep(id).goesTo
            return st[opt]
        } catch(err){
            console.log('Erro na procura do próximo passo.\n', err)
            return id
        }
    }

    lastStepId(id, opt=0){
        try{
            return this.currentStep(id).comesFrom[opt]
        } catch(err){
            console.log('Erro na procura do passo anterior.\n', err)
            return id
        }
    }
    //==================================================//
}

class ChatStep{             //Unidade mínima de conversação
    constructor(msg, fulfill, unFulfill, defaul=[], afterRec={}, from, to){
        this.msgs = msg
        this.fulfill = fulfill
        this.unFulfill = unFulfill
        this.default = defaul
        this.afterRec = afterRec?afterRec:{}
        this.comesFrom = typeof(from)==='object'?from:[from]
        this.goesTo = typeof(to)==='object'?to:[to]
    }

    /**
     * @param {Number} id
     */
    set regId(id){
        this.id = id
    }
}

let chat = new ChatFlow(recorrent)
messages.forEach((i) => {
    chat.newStep = new ChatStep(i['txt'], i['full'], i['unf'], i['def'], i['afterRec'], i['from'], i['to'])
})

export { chat }