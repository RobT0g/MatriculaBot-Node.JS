import { mysql } from '../Dependencies/Index.js'

/** TODO
 * Implementar a leitura da tabela cursowrds
 * Refazer o effetivate
 */

 class DataBaseCon{
    constructor(){
        this.loaded = false
        this.users = {}
    }

    async connect(){
        try{
            if(this.con && this.con.state != 'disconnected')	//Isso garante que a conexão está ativa na execução
                return this.con
        } catch(err){
            console.log(err)
        }
        const con = await mysql.createConnection({
            host        : 'localhost',
            user        : 'root',
            password    : '',
            database    : 'venom'
        });	
        this.con = con	
        console.log('Conectado.')
        return this.con
    }

    async load() {
        if(this.loaded)
            return
        this.cursos = {}, this.cursosName = {}
        this.disciplinasId = {}, this.amount = {}
        let conn = await this.connect()
        let info = (await conn.query(`select * from cursos;`))[0]
        info.forEach((v) => {
            this.cursos[v.id] = v.abrev
            this.cursosName[v.id] = v.cursonome
        })
        for(let i in this.cursos){
            this.disciplinasId[this.cursos[i]] = (((await conn.query(`select id from disc_${this.cursos[i]} 
                group by periodo;`))[0]).map((j) => j.id))
            this.amount[this.cursos[i]] = (await conn.query(`select max(id) from disc_${this.cursos[i]};`))[0][0]['max(id)']
        }
        this.loaded = true
    }

    async request(sql) {
        //console.log(sql)
        if(!this.loaded)
            await this.load()
        try {
            let conn = await this.connect()
            return (await conn.query(sql))
        } catch (err) {
            console.log('Erro no request.\n', err)
        }
    }

    async getUser(num){
        try{
            if(num in this.users)
                return this.users[num]
            let user = (await this.request(`select id, matricula, cpf, talkat, nome, email, curso, turma from registro where numero = ${num};`))[0][0]
            if(!user){
                return null
            }
            this.users[num] = user
            return user
        } catch(err){
            return null
        }
    }

    async refreshUser(num){
        let user = (await this.request(`select id, matricula, cpf, talkat, nome, email, curso, turma from registro where numero = ${num};`))[0][0]
        if(user)
            this.users[num] = user
    }
}

const db = new DataBaseCon()

class FormatedData{
    constructor(){
        this.requests = {
            userData            : async (tag, num) => {
                let eff = (await db.request(`select data from effetivate where numero = '${num}';`))[0][0]
                if(eff){
                    eff = JSON.parse(eff.data)
                    if(tag in eff)
                        return eff[tag]
                }
                return (await db.request(`select ${tag} from registro where numero = '${num}' and finished = '0';`))[0][0][tag]
            },
            '~mat~'             : async (num) => {
                return this.requests.userData('matricula', num)
            },
            '~nome~'            : async (num) => {
                return this.requests.userData('nome', num)
            },
            '~email~'           : async (num) => {
                return this.requests.userData('email', num)    
            },
            '~curso~'           : async (num) => {
                return db.cursosName[(await this.requests.userData('curso', num))]
            },
            '~turma~'           : async (num) => {
                return this.requests.userData('turma', num)    
            },
            '~cpf~'             : async (num) => {
                return this.requests.userData('cpf', num)
            },
            '~recdisc~'         : async (num) => {
                let info = await db.getUser(num)
                let y = new Date().getFullYear() - info.turma
                let req = db.disciplinasId[db.cursos[info.curso]][(y >= db.disciplinasId[db.cursos[info.curso]].length)?-1:y]
                let data = (await db.request(`select id, nome, carga from disc_${db.cursos[info.curso]} 
                    where id not in (select discId from req_${db.cursos[info.curso]} where 
                    reqId >= '${req}') and ativa = '1';`))[0]
                let retn = ''
                data.forEach((i, k) => {
                    retn += `\n${i.id} - ${i.nome} (${i.carga} horas)${k == data.length-1?'.':';'}`
                })
                return retn 
            },
            '~actvdiscs~'       : async (num) => {
                let user = await db.getUser(num)
                let [discs] = await db.request(`select id, nome, carga from disc_${db.cursos[user.curso]} where ativa = '1';`)
                return discs.reduce((acc, i) => {
                    acc += `\n> ${i.id}. ${i.nome} (${i.carga} horas);`
                    return acc
                }, '').slice(0, -1) + '.'
            },
            '~userinfo~'        : async (num) => {
                let user = await db.getUser(num)
                return `\n> ${(user.matricula)?('Matricula: ' + user.matricula):('CPF: ') + user.cpf};\n> Nome: ${data.nome};` + 
                `\n> Email: ${data.email};\n> Curso: ${db.cursosName[data.curso]}, da turma de ${data.turma}.`
            },
            'getdiscs'          : async (num) => {
                let info = await db.getUser(num)
                return (await db.request(`select u.discId, d.nome, d.carga from user_${db.cursos[info.curso]} as u 
                    join disc_${db.cursos[info.curso]} as d on u.discId = d.id where u.userId = '${info.id}' order by u.discId;`))[0]
            },
            '~discesc~'         : async (num) => { 
                let data = await this.requests['getdiscs'](num)
                if(data.length == 0)
                    return '\nVocê ainda não selecionou nenhuma matéria.'
                try{
                    return data.reduce((acc, i) => {
                        acc += `\n> ${i.discId}. ${i.nome} (${i.carga} horas);`
                        return acc
                    }, '').slice(0, -1) + '.'
                } catch(err){
                    console.log('Erro em ~discesc~.\n', err)
                    return 'Você ainda não selecionou nenhuma matéria.'
                }
            },
            '~discesctxt~'      : async (num) => {
                let data = await this.requests['getdiscs'](num)
                if(data.length > 0)
                    return 'Estas são as matérias que estão registradas para você até então:' + (await this.requests['~discesc~'](num))
                return 'Você ainda não escolheu nenhuma matéria.'
            },
            '~getmatriz~'       : async (num) => {
                return (await db.request(`select text from messages where tag = '~getmatriz~';`))[0][0].text
            },
            '~depart~'          : async (num) => {
                return (await db.request(`select text from messages where tag = '~depart~';`))[0][0].text
            },
            '~numdepart~'       : async (num) => {
                return (await db.request(`select text from messages where tag = '~numdepart~';`))[0][0].text
            },
            '~instmatseladd~'   : async (num) => {
                let info = await this.requests.getsubjectsoneff(num)
                console.log(info)
                let user = await db.getUser(num)
                let reqs = (await Promise.all(Object.keys(info.outuser).reduce((acc, i) => {
                    if(info.outuser[i].ativa === 1)
                        acc.push(db.request(`select r.reqId, d.nome from req_${db.cursos[user.curso]} as r join disc_${db.cursos[user.curso]} as
                            d on r.reqId = d.id where r.discId = '${i}';`))
                    else
                        acc.push([[]])
                    return acc
                }, [])))
                reqs = Object.keys(info.outuser).reduce((acc, i, k) => {
                    acc[i] = reqs[k][0]
                    return acc
                }, {})
                let ativas = 0
                let txt = '', inat = []
                Object.keys(info.outuser).forEach((i, k) => {
                    if(info.outuser[i].ativa === 1){
                        ativas++
                        if(txt !== '')
                            txt += `\n----------------------------\n`
                        txt += `${i} - ${info.outuser[i].nome} (${info.outuser[i].carga} horas).`
                        if(reqs[i].length === 0)
                            txt += ` Sem requisitos.`
                        else{
                            txt += ` Requisitos:${reqs[i].reduce((acc, j) => {
                                acc += `\n> ${j.reqId} - ${j.nome};`
                                return acc
                            }, '').slice(0, -1) + '.'}` 
                        }
                    } else {
                        inat.push(i)
                    }
                })
                let inu = Object.keys(info.inuser)
                if(inu.length === 0 && inat.length === 0 && info.inval.length === 0){
                    return txt
                }
                let plu = [inu.length > 1, inat.length > 1, info.inval.length > 1]
                txt += `.//Além dessa${ativas > 1?'s':''}, você também havia escolhido ` + 
                    `essa${plu[0]||plu[1]||plu[2]?'s':''} de número `
                let extra = [null, null, null]
                if(inu.length > 0){
                    extra[0] = `${inu.reduce((acc, i, k) => {
                        acc += `${i}${k!==inu.length-2?', ':' e '}`
                        return acc
                    }, '').slice(0, -2)} que já est${plu[0]?'ão':'á'} na sua lista`
                }
                if(inat.length > 0 ){
                    extra[1] = `${inat.reduce((acc, i, k) => {
                        acc += `${i}${k!==inat.length-2?', ':' e '}`
                        return acc
                    }, '').slice(0, -2)} que não est${plu[1]?'ão':'á'} disponíve${plu[1]?'is':'l'} para este período`
                }
                if(info.inval.length > 0){
                    extra[2] = `${info.inval.reduce((acc, i, k) => {
                            acc += `${i}${k!==info.inval.length-2?', ':' e '}`
                            return acc
                        }, '').slice(0, -2)} que nem existe${plu[2]?'m':''} na matriz curricular do curso de ${db.cursosName[user.curso]}`
                }
                let result = extra.reduce((acc, i) => {
                    if(i) acc++
                    return acc
                }, 0)
                if(result === 1)
                    return `${txt}${extra[0]?extra[0]:(extra[1]?extra[1]:extra[2])}.`
                if(result === 2)
                    return `${txt}`+(extra[0]?`${extra[0]} e ${extra[1]?extra[1]:extra[2]}.`:`${extra[1]} e ${extra[2]}.`)
                return `${txt}${extra[0]}, ${extra[1]} e ${extra[2]}.`
            },
            '~instmatseldel~'   : async (num) => {
                let info = await this.requests.getsubjectsoneff(num)
                let txt = ['', '']
                Object.keys(info.inuser).forEach((i, k) => {
                    if(k !== 0)
                        txt[0] += `\n`
                    txt[0] += `> ${i} - ${info.inuser[i].nome} (${info.inuser[i].carga} horas);`
                })
                let out = Object.keys(info.outuser)
                if(out.length + info.inval.length === 0){
                    return txt[0]
                }
                out.push(...info.inval)
                let plu = out.length > 1
                txt[1] += `Aliás, você também tinha me pedido para retirar a${plu?'s':''} disciplina${plu?'s':''} de número ${out.reduce((acc, i, k) => {
                    acc += `${i}${k!==out.length-2?', ':' e '}`
                    return acc
                }, '').slice(0, -2)}. Eu ignorei esse${plu?'s':''} número${plu?'s':''} porque ele${plu?'s':''} nem est${plu?'ão':'á'} na sua lista.`
                return `${txt[0]}.//${txt[1]}`
            },
            'getsubjectsoneff'  : async (num) => {
                let user = await db.getUser(num)
                let [[discs]] = await db.request(`select data from effetivate where numero = '${num}';`)
                discs = JSON.parse(discs.data).ids.map(i => Number(i))
                let [[userdiscs], [valdiscs]] = await Promise.all([db.request(`select discId from user_${db.cursos[user.curso]} where 
                    userId = '${user.id}';`), db.request(`select id, nome, carga, ativa from disc_${db.cursos[user.curso]} where id in 
                    (${discs.reduce((acc, i) => {
                        acc += `'${i}', `
                        return acc
                    }, '').slice(0, -2)});`)])
                userdiscs = userdiscs.map(i => i.discId)
                valdiscs = valdiscs.reduce((acc, i) => {
                    acc[i.id] = i
                    return acc
                }, {})
                let info = {inuser: {}, outuser: {}, inval: []}
                discs.forEach(i => {
                    if(i > db.amount[db.cursos[user.curso]]){
                        info.inval.push(i)
                    } else if(userdiscs.includes(i)){
                        info.inuser[i] = valdiscs[i]
                    } else {
                        info.outuser[i] = valdiscs[i]
                    }
                })
                return info
            },
            '~relatorio~'         : async (num) => {
                let users = (await db.request(`select * from registro where finished = '1';`))[0].reduce((acc, i) => {
                    if(!(db.cursos[i.curso] in acc))
                        acc[db.cursos[i.curso]] = []
                    acc[db.cursos[i.curso]].push(i)
                    return acc
                }, {})
                let txt = ''
                for(let i in users){
                    let info = (await db.request(`select u.*, d.nome from user_${i} as u join disc_${i} as d on u.discId = d.id where matricula in (${users[i].reduce((acc, j) => {
                        acc += `'${j.matricula}', `
                        return acc
                    }, '').slice(0, -2)}) order by u.discId;`))[0].reduce((acc, j) => {
                        if(!(j.matricula in acc))
                            acc[j.matricula] = []
                        acc[j.matricula].push(j)
                        return acc
                    }, {})
                    for(let j in users[i]){
                        try{
                            txt += `Usuário de matricula ${users[i][j].matricula}. Demais informações:\n> Nome: ${users[i][j].nome};\n> Email: ${users[i][j].email};\n` + 
                            `> Curso: ${db.cursosName[users[i][j].curso]}, da turma de ${users[i][j].turma};\n` + 
                            `> CPF: ${users[i][j].cpf}.\n-------------------------\nMatéria registradas:${info[users[i][j].matricula].reduce((acc, k) => {
                                acc += `\n> ${k.discId}. ${k.nome};`
                                return acc
                            }, '').slice(0, -1) + '..//'}`
                        } catch(err){
                            console.log(err)
                        }
                    }
                }
                return txt
            },
            '~finalizar~'       : async (num) => {
                let user = await db.getUser(num)
                if((await db.request(`select * from user_${db.cursos[user.curso]} where userId = '${user.id}';`))[0].length == 0){
                    return ''
                }
                return 'Como você já selecionou algumas matérias, você pode finalizar aqui se quiser. Basta me mandar um "finalizar".'
            },
        }
    }

    async getTextInfo(tag, num){
        try{
            return await this.requests[tag](num)
        } catch(err){
            console.log('Erro ao retornar a informação.\n', err)
            return tag.slice(1, -1)
        }
    }

    formateData(msg, data, tag){
        return msg.replaceAll(tag, this.formate[tag](data))
    }

    setInfoOnObj(objInitial, ids){
        let obj = {}
        Object.keys(objInitial).map((i) => {obj[i] = objInitial[i]})
        try{
            let date = new Date()
            let periodo = ((date.getFullYear()-obj.turma)*2) + (date.getMonth()>=6?1:0)
            let cursoIds = ids[db.cursos[obj.curso]]
            obj.maxreq = cursoIds[periodo>=cursoIds.length?-1:periodo]
            return obj
        } catch(err){
            console.log('Erro ao Informar o curso para obj.\n', err)
            return objInitial
        }
    }
}

const fd = new FormatedData()

class DataBaseAccess{
    constructor(){
        this.loaded = false
    }

    addUser(num){
        try{
            return db.request(`insert into registro (id, numero, talkat) values (default, '${num}', '0');`)
        } catch(err){
            console.log(err)
        }
    }

    async updateUser(num, obj, eff = true){
        let line = Object.keys(obj).reduce((acc, i) => {
            acc += `${i} = "${obj[i]}", `
            return acc
        }, '').slice(0, -2)
        try{
            let user = await db.getUser(num)
            let sql = `update registro set ${line} where numero = "${num}";`
            if(eff)
                return await this.saveOnEffetivate(num, sql, obj)
            await db.request(sql.replaceAll(`"`, `'`))
        } catch(err){
            console.log(err)
        }
    }

    async saveOnEffetivate(num, sql, data){
        let query = sql.replaceAll(`'`, `"`)
        let prev = (await db.request(`select * from effetivate where numero = '${num}';`))[0]
        if(prev.length === 0)
            await db.request(`insert into effetivate values ('${num}', '${query}', '${JSON.stringify(data)}');`)
        await db.request(`update effetivate set query = '${query}', data = '${JSON.stringify(data)}' where numero = '${num}';`)
    }

    async effetivate(num){
        let sql = await db.request(`select query from effetivate where numero = '${num}';`)
        if(sql[0][0]){
            sql = sql[0][0].query.split(';').slice(0, -1)
            let querys = []
            for(let i in sql)
                querys.push(db.request(sql[i].replaceAll(`"`, `'`) + ';'))
            await Promise.all(querys)
            await Promise.all([db.request(`delete from effetivate where numero = '${num}';`), db.refreshUser(num)])
        }
    } 
    
    async getEffetivate(num){
        return JSON.parse((await db.request(`select data from effetivate where numero = '${num}';`))[0][0].data)
    }

    getRequest(tag, num){
        return fd.getTextInfo(tag, num)
    }
}

const database = new DataBaseAccess()

export { db, fd, database }