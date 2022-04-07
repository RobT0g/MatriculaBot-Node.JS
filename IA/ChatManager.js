import {chat} from './ChatFlow.js'
import { database } from './DataKeeper.js'

//--------TODO--------//
/**
 *  
 */ 

/*
    TagAnalyzer é uma classe que contém diversas funções que conseguem detectar e extrair determinadas 
    informações da mensagem (Classe Message) com base no sistema de tags existentes.
    As tags se apresentam basicamente de duas formas:
    > '~tag~' -> Referencia uma informação com uma função especifica
    > 'kwrd1&kwrd2' -> Refencia a existencia de determinadas palavras chaves no texto
*/
class TagAnalyzer{
    constructor(){
        this.altTags = {'datanas':'nascimento', 'mat':'matricula', 'addmatnums': 'discId'}
        this.tagfunc = {
            '~sim~'     : ((msg) => {return [(['sim', 'ok', 'certo', 'beleza', 'concordo'].some((x) => msg.wrds.includes(x)) || 
            msg.wrds.includes('tudo') && msg.wrds.includes('bem')) &&
            !msg.wrds.includes('nao'), '']}),
            '~nao~'     : ((msg) => {return [(['nao', 'discordo', 'errado'].some((x) => msg.wrds.includes(x))) &&
            !msg.wrds.includes('sim'), '']}),
            '~nome~'    : ((msg) => {
                try{
                    if(msg.wrds.length > 1){
                        return [true, msg.wrds.reduce((acc, i) => {acc += ['do', 'de', 'da'].includes(i)?(
                        i + ' '):(i.charAt(0).toUpperCase() + i.slice(1) + ' '); return acc}, '').trim()]
                        //^ Junta as palavras pra formar um nome. Se elas não forem ['do', 'de', 'da'] , elas serão
                        //capitalizadas.
                    }
                    return [false, '']
                } catch(err){
                    console.log('Erro na tag ~nome~.\n', err)
                    return [false, '']
                }
            }),
            '~cpf~'     : ((msg) => {
                try{
                    let numb = msg.msgbody.match(/\d{11}|(\d{3}[.]\d{3}[.]\d{3}[-]\d{2})/g)
                    //^ Primeira tentativa: 11 números em sequencia ou no formato 123.456.789-10 ^//
                    if(numb != [])
                        return [true, numb[0].replaceAll(/[.]|[-]/g, '')]
                    numb = (msg.msgbody.match(/\d/g)).reduce((acc, i)=>{acc+=i;return acc},'') 
                    //^ segunda tentativa: pega todos os números independentemente e os junta ^//
                    if(numb.length == 11)
                        return [true, numb]
                    return [false, '']
                } catch(err){
                    console.log('Erro na tag ~cpf~.\n', err)
                    return [false, '']
                }
            }),
            '~datanas~' : ((msg) => {
                let data = msg.msgbody.match(/\d+/g)
                try{
                    if(data.length == 3){
                        return this.isDateValid(data)?[true, this.formatedDate(data)]:[false, '']
                    } else if(data.length == 2) {
                        let meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 
                            'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
                        let mes = meses.reduce((acc, i, k) => {new RegExp(i, 'g').test(msg.filterMsg)?acc=k:null; return acc},-1)+1
                        data.splice(1, 0, mes.toString())
                        console.log(data)
                        if(mes != -1)
                            if(this.isDateValid(data))
                                return [true, this.formatedDate(data)]
                    }
                    return [false, '']
                } catch(err){
                    console.log('Erro na tag ~datanas~.\n', err)
                    return [false, '']
                }
            }),
            '~mat~'     : ((msg) => {
                //Alguma formatação aqui????
                try{
                    let data = msg.msgbody.match(/\S+/g).reduce((acc, i) => {
                        acc = /\d+[a-zA-Z]*\d*/g.test(i)?i:''; return acc}, '')
                    data = (typeof data == 'object')?data[0]:data
                    if(data && data !== '')
                        return [true, data]
                    return [false, '']
                }catch(err){
                    console.log('Erro na tag ~mat~.\n', err)
                    return [false, '']
                }
            }),
            '~email~'   : ((msg) => {
                try{
                let data = msg.msgbody.toLowerCase().match(/\S+/g).reduce((acc, i) => {acc = (/[@]/g.test(i)?i:acc); return acc},'');
                data = (typeof data == 'object')?data[0]:data
                console.log(data)
                if(data && data !== '')
                    return [true, data]
                return [false, '']
                } catch(err){
                    console.log('Erro na tag ~email~.\n', err)
                }
            }),
            '~curso~'   : ((msg) => {
                let cursos = [['adm', 'administracao'], ['engenharia', 'computacao'], ['fis', 'fisica'], ['tce', 'construcao']]
                let opt = cursos.map((i) => i.some((j) => this.keyword(msg, j)[0]))
                if(opt.includes(true))
                    return [true, String(opt.indexOf(true)+1)]
                return [false, '']
            }),
            '~turma~'     : ((msg) => {
                let ano = msg.msgbody.match(/\d{4}/g)
                if(ano.length > 0)
                    return [true, ano[0]]
                return [false, '']
            }),
            '~num~'     : ((msg) => {
                let num = msg.msgbody.match(/\d+/g)
                if(num)
                    return [true, num]
                return [false, '']
            }),
            '~discnome~': ((msg) => {return [false, '']}),
            '1-wrd'     : ((msg) => {return [msg.wrdslen == 1, '']}),
            '~matnums~' : ((msg) => {
                let nums = msg.msgbody.match(/\d+/g)
                return nums?[true, nums]:[false, '']
            }),
            '~def~'     : ((msg) => {return [true, '']}),
            '~nop~'     : ((msg) => {return [false, '']})
        }
        this.keyword = ((msg, tag) => {
            return [!tag.split(/[&]/g).some((j) => !(new RegExp(j, 'g').test(msg.filterMsg.toLowerCase()))), '']});
        this.getUpdateObj = (obj) => {
            let ret = {}
            let tag = obj.stepTags[0].slice(1, -1)
            ret[tag in this.altTags?this.altTags[tag]:tag] = obj.tagInfo[1]
            return ret
        }
        this.actions = {
            'prepareUser'   : async (man, obj, num) => {
                let user = await database.getUserInfo(num)
                let sql = `insert into registro (matricula, numero, talkat) values ("${obj.tagInfo[1]}", "${num}", "${user.talkat}"); delete from inst_cadastro where numero = "${num}";`
                if('matricula' in user)
                    sql = `update registro set matricula = "${obj.tagInfo[1]}" where numero = "${num}" and finished = "0";`
                await database.saveOnEffetivate(num, sql, this.getUpdateObj(obj))
            },
            'effetivate'    : async (man, obj, num) => {
                await database.effetivate(num)
            }, 
            'goBack'        : async (man, obj, num) => {
                await man.move.goBack()
            },
            'updateUser'    : async (man, obj, num) => {
                await database.updateUser(num, this.getUpdateObj(obj))
            },
            'insUpdateUser' : async (man, obj, num) => {
                let prev
            }
        }
    }

    getTag(tag, msg){
        try{
            if(/[~]/g.test(tag))
                return  this.tagfunc[tag](msg)
            if(/[*]/g.test(tag)){
                let res = this.tagfunc[tag](msg)
                return  [!res[0], res[1]]
            }
            if(/[&]|[!]/g.test(tag)){
                let [ins, ...out] = tag.split('!')
                return [this.keyword(msg, ins.slice(1))[0] && 
                    !out.some((i) => tags.keyword(msg, i)[0]), '']
            }
            return this.keyword(msg, tag)
        } catch(err) {
            console.log(err)
            return [false, '']
        }
    }

    isDateValid(date){
        //Recebe a data no formato ['dia', 'mes', 'ano'] (números)
        let cd = new Date()
        let data = date.map((i) => parseInt(i))
        let valid = [1, 2].includes(date[0].length) && [1, 2].includes(date[1].length) &&
            [2, 4].includes(date[2].length) && data[1] > 0 && data [1] <= 12 && 
            data[2] < cd.getFullYear()-12 && data[0] > 0 
        if([1, 3, 5, 7, 8, 10, 12].includes(data[1]))
            valid = valid && data[0] <= 31
        else if(data[1] == 2)
            valid = valid && ((data[2]%4 == 0)?(data[0]<=29):(data[0]<=28))
        else
            valid = valid && data[0] <= 30
        return valid
    }

    formatedDate(data){
        //Pega a data no formato ['dia', 'mes', 'ano'] (números) e a transforma em string dia/mes/ano
        return `${data[0].length == 1?'0'+data[0]:data[0]}/` + 
        `${data[1].length == 1?'0'+data[1]:data[1]}/${data[2].length == 2?'19'+data[2]:data[2]}`
    }

    async handleAction(manager, obj, num){
        //console.log(obj)
        try{
            for(let i in obj.actions)
                await this.actions[obj.actions[i]](manager, obj, num)
        } catch(err){
            console.log(err)
        }
    }

    getStepObject(step, msg, full = true){
        try{let cond = full?'fulfill':'unFulfill'
            let obj = { stepTags: step[cond].getTags() }                        //[[full1Tag1, full1Tag2], [full2Tag1]]
            obj.tagInfo = obj.stepTags.map((i) =>  i.reduce((acc, j, k) => {    //[[f1Res, Data], [f2Res, Data]]
                let t =  this.getTag(j, msg);
                acc[0] = acc[0] || t[0];
                acc[1] = k==0?t[1]:acc[1]
                return acc
            }, [false, '']))
            obj.outcomes = obj.tagInfo.map((i) => i[0])                         //[fulfill1_Res, fulfill2_Res]
            obj.actions = step[cond].getActions()
            return obj
        } catch(err){
            return {}
        }
    }
}

const tags = new TagAnalyzer()

class ChatManager{  //Cada usuário contém uma instância do manager, para facilitar a movimentação no flow
    constructor(num){
        this.talkat = 0
        this.num = num
        this.move = {
            refStep : async() => {          //Atualiza o step atual de acordo com o id
                this.step = chat.currentStep(this.talkat)
                await database.updateUser(this.num, {talkat: this.talkat})
            },
            goNext  : async (opt=0) => {        //Avança para o próximo step
                this.talkat = chat.nextStepId(this.talkat, opt)
                await this.move.refStep()
            },
            goBack  : async (opt=0) => {       //Retorna para o step anterior
                this.talkat = chat.lastStepId(this.talkat, opt)
                await this.move.refStep()
            },
            goTo    : async (newID) => {          //Vai para um step específico
                this.talkat = newID
                await this.move.refStep()
            },
        }
    }

    newMessage(msg){     //Chamado quando uma mensagem é recebida
        try{
            let results = tags.getStepObject(this.step, msg, true)
            console.log(results)                           
            if(![0, 1].includes(results.outcomes.filter((i) => i==true).length)){
                console.log('PROBLEMA AQUI, MULTIPLA CONDIÇÃO DE FULFILL ENCONTRADA!')
            }
            let opt = results.outcomes.indexOf(true)
            if(opt != -1){
                Object.keys(results).forEach((i) => { results[i] = results[i][opt] })
                results.opt = opt
                return this.fulfillStep(results)
            }
            results = tags.getStepObject(this.step, msg, false)
            if((Object.entries(this.step.unFulfill).length === 0) || results.tagInfo === [] || !results.outcomes.includes(true))
                return this.step.default
            opt = results.outcomes.indexOf(true)
            Object.keys(results).forEach((i) => { results[i] = results[i][opt] })
            results.opt = opt
            return this.unfulfillStep(results)
        } catch(err){
            console.log(err)
            return ['Houve um erro na minha execução. Se ele persistir, leia a descrição desse perfil.', 
                'Poderia repetir o que havia tentado dizer antes?']
        }
    }

    async fulfillStep(obj){         //Chamada quando um step é fulfill
        if(obj.actions.length > 0)
            await tags.handleAction(this, obj, this.num)
        await this.move.goNext(obj.opt)
        return await this.setDataOntoText(this.step.msgs, num)
    }

    async unfulfillStep(obj){       //Chamada quando um step não é fulfill
        let st = this.step
        if(obj.actions.length > 0)
            await tags.handleAction(this, obj, this.num)
        if(st.unFulfill[obj.stepTags[0]].msg.length > 0)
            return await this.setDataOntoText(st.unFulfill[obj.stepTags[0]].msg, num)
        return await this.setDataOntoText(this.step.msgs, num)
    }

    async setDataOntoText(msg, num){
        try {
            if(!msg.some((i) => /[~]\w+[~]/g.test(i)))
                return msg
            return database.setDataOntoText(num)
        } catch(err){
            console.log('Erro em setDataOntoText (ChatManager).\n', err)
            return msg
        }
    }
}

export {ChatManager, tags}