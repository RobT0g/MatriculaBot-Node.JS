import {chat} from './ChatFlow.js'
import { db, fd, database } from './DataKeeper.js'

//--------TODO--------//
/**
 * Validação de cpf
 * Validação de email
 * Respostas recorrentes está substituindo o ~def~
 * Revisar a parte de retirar ou adicionar matérias já escolhidas anteriormente
 */ 

class TagAnalyzer{
    constructor(){
        this.altTags = {'datanas':'nascimento', 'mat':'matricula', 'addmatnums': 'discId'}
        this.tagfunc = {
            '~sim~'         : ((msg) => {return [(['sim', 'ok', 'certo', 'beleza', 'concordo'].some((x) => msg.wrds.includes(x)) || 
            msg.wrds.includes('tudo') && msg.wrds.includes('bem')) &&
            !msg.wrds.includes('nao'), '']}),
            '~nao~'         : ((msg) => {return [(['nao', 'discordo', 'errado'].some((x) => msg.wrds.includes(x))) &&
            !msg.wrds.includes('sim'), '']}),
            '~nome~'        : ((msg) => {
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
            '~1-wrd~'       : ((msg) => {
                return [msg.wrds.length == 1, '']
            }),
            '~cpf~'         : ((msg) => {
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
            '~datanas~'     : ((msg) => {
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
            '~getmat~'         : ((msg) => {
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
            'matvalidate'   : (data, valid) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        let a = await db.request(`select matricula from registro where matricula = '${data[1]}';`)
                        if(valid && !a[0][0])
                            resolve([true, data[1]])
                        else if(!valid && a[0][0])
                            resolve([true, a[0][0].matricula])
                        resolve([false, ''])
                    } catch(err){
                        reject(err)
                    }
                })
            },
            '~mat~'    : ((msg) => {
                let data = this.tagfunc['~getmat~'](msg)
                if(data[0])
                    return this.tagfunc['matvalidate'](data, true)
                return [false, '']
            }),
            '~matex~'       : ((msg) => {
                let data = this.tagfunc['~getmat~'](msg)
                if(data[0])
                    return this.tagfunc['matvalidate'](data, false)
                return [false, '']
            }),
            '~email~'       : ((msg) => {
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
            '~curso~'       : ((msg) => {
                let cursos = [['adm', 'administracao'], ['engenharia', 'computacao'], ['fis', 'fisica'], ['tce', 'construcao']]
                let opt = cursos.map((i) => i.some((j) => this.keyword(msg, j)[0]))
                if(opt.includes(true))
                    return [true, String(opt.indexOf(true))]
                return [false, '']
            }),
            '~turma~'       : ((msg) => {
                let ano = msg.msgbody.match(/\d{4}/g)
                if(ano.length > 0)
                    return [(new Date().getFullYear()-ano[0] <= 10), ano[0]]
                return [false, '']
            }),
            '~num~'         : ((msg) => {
                let num = msg.msgbody.match(/\d+/g)
                if(num)
                    return [true, num]
                return [false, '']
            }),
            '~discnome~'    : ((msg) => {return [false, '']}),
            '1-wrd'         : ((msg) => {return [msg.wrds.length == 1, '']}),
            '~matnums~'     : ((msg) => {
                let nums = msg.msgbody.match(/\d+/g)
                return nums?[true, nums]:[false, '']
            }),
            '~voltar~'      : ((msg) => {return this.keyword(msg, 'voltar')}),
            '~finalizar~'   : ((msg) => {return this.keyword(msg, 'finalizar')}),
            '~matriz~'      : ((msg) => {return this.keyword(msg, '&matriz&curricular')}),
            '~depart~'      : ((msg) => {return this.keyword(msg, '&contatar&departamento')}),
            '~revisar~'     : ((msg) => {return this.keyword(msg, 'revisar')}),
            '~def~'         : ((msg) => {return [true, '']}),
            '~nop~'         : ((msg) => {return [false, '']})
        }
        this.keyword = ((msg, tag) => {
            return [!tag.split(/[&]/g).some((j) => !(new RegExp(j, 'g').test(msg.filterMsg.toLowerCase()))), '']});
        this.getUpdateObj = (obj) => {
            let ret = {}
            let tag = obj.stepTags[0].slice(1, -1)
            ret[tag in this.altTags?this.altTags[tag]:tag] = obj.tagInfo[1]
            return ret
        }
        this.actionsReferences = {'goTo': /\d+/g}
        this.actions = {
            'prepareUser'   : async (man, obj, num) => {
                let user = await fd.getUser(num)
                let sql = `insert into registro (matricula, numero, talkat) values ("${obj.tagInfo[1]}", "${num}", "${user.talkat}"); delete from inst_cadastro where numero = "${num}";`
                if('matricula' in user)
                    sql = `update registro set matricula = "${obj.tagInfo[1]}" where numero = "${num}" and finished = "0";`
                await database.saveOnEffetivate(num, sql, this.getUpdateObj(obj))
            },
            'effetivate'    : async (man, obj, num) => {
                await database.effetivate(num)
            },
            'goTo'          : async (man, obj, num) => {
                num = obj.actions.filter((i) => /\d+/.test(i))[0].match(/\d+/g)[0]
                await man.move.goTo(Number(num))
            },
            'updateUser'    : async (man, obj, num) => {
                await database.updateUser(num, this.getUpdateObj(obj))
            },
            'insUpdateUser' : async (man, obj, num) => {
                let prev = await database.getEffetivate(num)
                obj.stepTags.forEach((i) => {
                    prev[i.slice(1, -1)] = obj.tagInfo[1]
                })
                await database.updateUser(num, prev)
            },
            'savedefdiscs'  : async (man, obj, num) => {
                let {curso, turma, matricula} = await fd.getUser(num)
                let maxp = (await db.request(`select max(periodo) from disc_${fd.cursos[curso]};`))[0][0]['max(periodo)']
                let date = new Date()
                let periodo = (date.getFullYear()-turma)*2 + ((date.getMonth() > 6)?2:1)
                if(periodo > maxp)
                    periodo = maxp
                let mats = (await db.request(`select id from disc_${fd.cursos[curso]} where parap = ${periodo};`))[0]
                await db.request(`insert into user_${fd.cursos[curso]} values ` + mats.reduce((acc, i) => {
                    acc += `(default, '${matricula}', '${i.id}', '${1}'), `
                    return acc
                }, '').slice(0, -2) + ';')
            },
            'add_discs'     : async (man, obj, num) => {
                await this.actions['managediscs'](man, obj, num, false)
            },
            'del_discs'     : async (man, obj, num) => {
                await this.actions['managediscs'](man, obj, num, true)
            },
            'managediscs'   : async (man, obj, num, del) => {
                let info = await (fd.getUser(num).then(async (user) => {
                    return {user, choices: (await db.request(`select discId from user_${fd.cursos[user.curso]} where matricula
                        = '${user.matricula}';`))[0]}
                }))
                let fnums = obj.tagInfo[1].filter(i => (Number(i) <= Number(db.amount[fd.cursos[info.user.curso]]))).map(i => Number(i))
                console.log(info.choices)
                let ondb = info.choices.reduce((acc, i) => {
                    if(fnums.includes(i.discId)){
                        fnums.splice(fnums.indexOf(i.discId), 1)
                        acc.push(i.discId)
                    }
                    return acc
                }, [])
                let sql = ''
                if(del){
                    sql = `delete from user_${fd.cursos[info.user.curso]} where discId in ${ondb.reduce((acc, i) => {
                        acc += `'${i}', `
                        return acc
                    }, '(').slice(0, -2) + ')'} and matricula = '${info.user.matricula}'; `
                }else {
                    sql += `insert into user_${fd.cursos[info.user.curso]} values ${fnums.reduce((acc, i) => {
                        acc += `(default, '${info.user.matricula}', '${i}'), `
                        return acc
                    }, '').slice(0, -2)};`
                }
                await database.saveOnEffetivate(num, sql, {ids: [...fnums, ...ondb]})
            },
            'finalize'      : async (man, obj, num) => {
                await (fd.getUser(num).then((user) => {
                    return db.request(`update registro set finished = '1' where matricula = '${user.matricula}';`)
                }))
            }
        }
    }

    getTag(tag, msg){
        try{
            if(/[~]/g.test(tag))
                return this.tagfunc[tag](msg)
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
        try{
            for(let i in obj.actions)
                if (obj.actions[i] in this.actions){
                    await this.actions[obj.actions[i]](manager, obj, num)
                } else {
                    let actionsList = Object.keys(this.actionsReferences)
                    for(let j in actionsList){
                        if(this.actionsReferences[actionsList[j]].test(obj.actions[i]))
                            await this.actions[actionsList[j]](manager, obj, num)
                    }
                }
        } catch(err){
            console.log(err)
        }
    }

    async getStepObject(step, msg, full = true){
        try{
            let cond = full?'fulfill':'unFulfill'
            let obj = { stepTags: step[cond].getTags() }                        //[[full1Tag1, full1Tag2], [full2Tag1]]
            obj.tagInfo = await Promise.all(obj.stepTags.map((i) => {
                return new Promise(async (resolve, reject) => {
                    let t = await this.getTag(i[0], msg)
                    let data = t[1]
                    if(t[0]){
                        resolve(t)
                        return
                    }
                    if(i.length > 0){
                        for(let j in i.slice(1)){
                            t = await this.getTag(i[j], msg)
                            if(t[0]){
                                resolve([t[0], data])
                                return
                            }
                        }
                    }
                    resolve([false, ''])
                })
            }))
            obj.outcomes = obj.tagInfo.map((i) => i[0])                         //[f1Res, f2Res]
            if(!obj.outcomes.includes(true))    //ISSO PODE DAR MERDA
                return {}
            obj.actions = step[cond].getActions()                               //[[act11, act12], [act21]]
            return obj
        } catch(err){
            console.log('Erro no getStepObject.\n', err)
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
                await database.updateUser(this.num, {talkat: this.talkat}, false)
            },
            goNext  : async (opt=0) => {        //Avança para o próximo step
                this.talkat = chat.nextStepId(this.talkat, opt)
                await this.move.refStep()
            },
            goTo    : async (newID) => {          //Vai para um step específico
                this.talkat = newID
                await this.move.refStep()
            },
        }
    }

    async newMessage(msg){     //Chamado quando uma mensagem é recebida
        let results, opt, problem = false
        try{
            results = await tags.getStepObject(this.step, msg, true)
            Object.keys(results).forEach((i) => {
                console.log(i, results[i])
            })
            opt = results.outcomes.indexOf(true)
            if(opt != -1){
                Object.keys(results).forEach((i) => { results[i] = results[i][opt] })
                results.opt = opt
                return this.fulfillStep(results)
            }
        } catch(err){
            problem = true
        }
        try{
            results = await tags.getStepObject(this.step, msg, false)
            if((Object.entries(results).length === 0) || results.tagInfo === [])
                return this.checkRecorrent(msg)
            opt = results.outcomes.indexOf(true)
            Object.keys(results).forEach((i) => { results[i] = results[i][opt] })
            results.opt = opt
            return this.unfulfillStep(results)
        }
        catch(err){
            console.log(err)
            if(problem)
                return ['Houve um erro na minha execução. Se ele persistir, leia a descrição desse perfil.', 
                'Poderia repetir o que havia tentado dizer antes?']
        }
        return this.step.default
    }

    async fulfillStep(obj){         //Chamada quando um step é fulfill
        console.log(obj)
        if(obj.actions.length > 0)
            await tags.handleAction(this, obj, this.num)
        await this.move.goNext(obj.opt)
        console.log(this.step)
        return this.setDataOntoText(this.step.msgs)
    }

    async unfulfillStep(obj){       //Chamada quando um step não é fulfill
        let st = this.step
        if(obj.actions.length > 0)
            await tags.handleAction(this, obj, this.num)
        if(st.unFulfill[obj.stepTags[0]].msg.length > 0)
            return await this.setDataOntoText(st.unFulfill[obj.stepTags[0]].msg, this.num)
        return await this.setDataOntoText(this.step.msgs, this.num)
    }

    checkRecorrent(msg){
        let ans = [false, '']
        console.log(this.step)
        for(let i in chat.recorrent){
            if(tags.getTag(i, msg)[0]){
                ans = [true, i]
                let msg = [...chat.recorrent[ans[1]]]
                try{
                    if([ans[1], 'any'].some(i => i in this.step.recomp)){
                        msg.push(...this.step.recomp[(ans[1] in this.step.recomp)?ans[1]:'any'])
                        console.log('sim')
                    }
                } catch(err){}
                return this.setDataOntoText(msg)
            }
        }
        return this.step.default
    }

    async setDataOntoText(msg){
        try{
            let requests = {}
            let txt = [...msg]
            for(let i in msg){
                try{
                    let tag = msg[i].match(/[~]\w+[~]/g)
                    for(let j in tag){
                        if(!(tag[j] in requests))
                            requests[tag[j]] = await database.getRequest(tag[j], this.num)
                        txt[i] = txt[i].replaceAll(tag[j], requests[tag[j]])
                    }
                } catch(err){}
            }
            if(txt.some((i) => /[~]\w+[~]/g.test(i)) && txt !== msg)
                return this.setDataOntoText(txt)
            return txt
        } catch(err){
            console.log('Erro em setDataOntoText (ChatManager).\n', err)
            return msg
        }
    }
}

export {ChatManager, tags}