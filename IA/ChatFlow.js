import {textkeep, defaultans, defdef, messages} from './Messages.js'

//--------TODO--------//
/**
 *  
 */ 

class ChatFlow{     //Guarda todo o fluxo
    constructor(){
        this.steps = []
        this.defdef = defdef
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

    //============== Funções de Utilidade ==============//
    getActions(id){
        let st = this.currentStep(id)
        return {full: Object.keys(st.fullfill).map((i) => st.fullfill[i].actions), unf: Object.keys(st.unFullfill).map((i) => st.unFullfill[i].actions)}
    }
    //==================================================//
}

class ChatStep{             //Unidade mínima de conversação
    constructor(msg, fullfill, unFullfill, defaul=[], from, to){
        this.msgs = msg
        this.fullfill = fullfill
        this.unFullfill = unFullfill
        this.default = defaul
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

let chat = new ChatFlow()
messages.map((i) => {
    chat.newStep = new ChatStep(i['txt'], i['full'], i['unf'], i['def'], i['from'], i['to'])
})

export { chat }