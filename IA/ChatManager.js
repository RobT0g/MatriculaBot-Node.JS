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
            '~ano~'     : ((msg) => {
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
            console.log(tag)
            return [!tag.split(/[&]/g).some((j) => !(new RegExp(j, 'g').test(msg.filterMsg.toLowerCase()))), '']})
        this.actions = {
            'updateUser'    : async (obj, tag, args) => {
                let data = new Object()
                data[tag] = args.info[1]
                await database.updateUser(obj.num, data)
            },
            'effetivateUser': async (obj) => {

            }, 
            'goBack'        : async (obj) => {
                await obj.move.goBack()
            },
            'effetivate'    : async (obj) => {

            },
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

    async handleAction(obj, tag, args){
        try{
            await this.actions[tag](obj, tag, args)
        } catch(err){
            console.log(err)
        }
    }

    getTagInfo(stepTags, msg){
        return stepTags.map((i) =>  i.reduce((acc, j, k) => {
            let t =  tags.getTag(j, msg);
            acc[0] = acc[0] || t[0];
            acc[1] = k==0?t[1]:acc[1]
            return acc
        }, [false, '']))
    }

    getStepObject(step, msg, full){
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
                await this.refStep()
            },
            goBack  : async (opt=0) => {       //Retorna para o step anterior
                this.talkat = chat.lastStepId(this.talkat, opt)
                await this.refStep()
            },
            goTo    : async (opt=0) => {          //Vai para um step específico
                this.talkat = newID
                await this.refStep()
            },
        }
    }

    newMessage(msg){     //Chamado quando uma mensagem é recebida
        try{
            let stepTags = this.step.fulfill.getTags()                          //[[full1Tag1, full1Tag2], [full2Tag1]]
            let tagInfo =  tags.getTagInfo(stepTags, msg)                       //[[f1Res, Data], [f2Res, Data]]
            let outcomes = tagInfo.map((i) => i[0])                             //[fulfill1_Res, fulfill2_Res]
            if(![0, 1].includes(outcomes.filter((i) => i==true).length)){
                console.log('PROBLEMA AQUI, MULTIPLA CONDIÇÃO DE FULFILL ENCONTRADA!')
            }
            let opt = outcomes.indexOf(true)
            let act = chat.getActions(this.talkat)
            if(opt != -1)
                return this.fulfillStep(stepTags[opt], tagInfo[opt], act.full[opt], opt)
            return  this.unfulfillStep(act.unf, msg)
        } catch(err){
            console.log(err)
            return ['Houve um erro na minha execução. Se ele persistir, leia a descrição desse perfil.', 
                'Poderia repetir o que havia tentado dizer antes?']
        }
    }

    async fulfillStep(tag, info, act, opt){         //Chamada quando um step é fulfill
        if(act)
            await tags.handleAction(this, tag, {info, act})
        await this.move.goNext(opt)
        return await this.setDataOntoText(this.step.msgs)
    }

    async unfulfillStep(act, msg){
        //Chamada quando um step não é fulfill
        let st = this.step
        if(Object.keys(st.unFulfill).length == 0)
            return st.default
        try{
            let stepTags = st.unFulfill.getTags()
            let tagInfo = await this.getTagInfo(stepTags, msg)
            let outcomes = tagInfo.map((i) => i[0])
            if(tagInfo === [] || !outcomes.includes(true))
                return this.step.default
            let opt = outcomes.indexOf(true)
            if(act[opt] === 'goBack')
                await this.move.goBack(opt)
            if(/goTo/g.test(act[opt]))
                await this.move.goTo(act[opt].slice(5))
            return await this.setDataOntoText(st.unFulfill[stepTags[opt][0]].msg)
        } catch(err){
            console.log('Erro no unfulfill!\n', err)
        }
        return st.default
    }

    async setDataOntoText(msg){
        try {
            return await database.setDataOntoText(msg, {'num': this.num})
        } catch(err){
            console.log('Erro em setDataOntoText (ChatManager).\n', err)
            return msg
        }
    }
}

export {ChatManager, tags}