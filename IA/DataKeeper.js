import { mysql } from '../Dependencies/Index.js'

/** TODO
 * Implementar testes para o uso de promises, o código não precisa esperar que o dado seja armazenado.
 */

 class DataBaseCon{
    constructor(){
        this.loaded = false
        this.cursos = ['adm', 'ec', 'fis', 'tce']
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
        this.disciplinasId = {}, this.amount = {}
        let conn = await this.connect()
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
}

const db = new DataBaseCon()

class FormatedData{
    constructor(){
        this.cursosName = ['Administração', 'Engenharia da Computação', 'Física', 'Construção de Edifícios']
        this.cursos = db.cursos
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
                return this.cursosName[(await this.requests.userData('curso', num))]
            },
            '~turma~'           : async (num) => {
                return this.requests.userData('turma', num)    
            },
            '~cpf~'             : async (num) => {
                return this.requests.userData('cpf', num)
            },
            '~defdisc~'         : async (num) => {
                let {curso, turma} = await this.getUser(num)
                let maxp = (await db.request(`select max(periodo) from disc_${this.cursos[curso]};`))[0][0]['max(periodo)']
                let date = new Date()
                let periodo = (date.getFullYear()-turma)*2 + ((date.getMonth() > 6)?2:1)
                if(periodo > maxp)
                    periodo = maxp
                let mats = await db.request(`select id, nome, carga from disc_${this.cursos[curso]} where parap = ${periodo};`)
                return mats[0].reduce((acc, i) => {
                    acc += `${i.id}. ${i.nome} (${i.carga} horas);\n`
                    return acc
                }, '').slice(0, -2) + '.'
            },
            '~recdisc~'         : async (num) => {
                let info = await this.getUser(num)
                let y = new Date().getFullYear() - info.turma
                let req = db.disciplinasId[this.cursos[info.curso]][(y >= db.disciplinasId[this.cursos[info.curso]].length)?-1:y]
                let data = (await db.request(`select id, nome, carga from disc_${this.cursos[info.curso]} 
                    where id not in (select discId from req_${this.cursos[info.curso]} where 
                    reqId >= '${req}') and ativa = '1';`))[0]
                let retn = ''
                data.forEach((i, k) => {
                    retn += `\n${i.id} - ${i.nome} (${i.carga} horas)${k == data.length-1?'.':';'}`
                })
                return retn 
            },
            '~actvdiscs~'       : async (num) => {
                let user = await this.getUser(num)
                let [discs] = await db.request(`select id, nome, carga from disc_${this.cursos[user.curso]} where ativa = '1';`)
                return discs.reduce((acc, i) => {
                    acc += `\n> ${i.id}. ${i.nome} (${i.carga} horas);`
                    return acc
                }, '').slice(0, -1) + '.'
            },
            '~userinfo~'        : async (num) => {
                let data = (await db.request(`select * from registro where numero = '${num}' and finished = '0';;`))[0][0]
                return `\n> Nome: ${data.nome};\n> Matricula: ${data.matricula};\n> Email: ${data.email};\n` + 
                    `> Curso: ${this.cursosName[data.curso]} turma de ${data.turma};\n` + 
                    `> CPF: ${data.cpf}.`
            },
            '~discesc~'         : async (num) => { 
                let info = (await db.request(`select * from registro where numero = '${num}' and finished = '0';`))[0][0]
                let data = (await db.request(`select u.discId, d.nome, d.carga from user_${this.cursos[info.curso]} as u 
                    join disc_${this.cursos[info.curso]} as d on u.discId = d.id where u.matricula = '${info.matricula}' order by u.discId;`))[0]
                if(data.length == 0)
                    return 'Você ainda não selecionou nenhuma matéria.'
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
                let data = await this.requests['getsubjectsoneff'](num)
                data.reqs = await Promise.all(data.info.map(async (i) => {
                    let ids = (await db.request(`select reqId from req_${this.cursos[data.user.curso]} where discId = ${i.id};`))[0]
                    if(ids.length == 1 && ids[0].reqId == 0)
                        return []
                    return (await db.request(`select id, nome from disc_${this.cursos[data.user.curso]} where id in 
                        (${ids.reduce((acc, i) => {
                            acc += i.reqId==0?'':`'${i.reqId}', `
                            return acc
                        }, '').slice(0, -2)});`))[0]
                }))
                return data.info.reduce((acc, i, k) => {
                    acc += (k > 0?'\n':'') + `${i.id} - ${i.nome} (${i.carga} horas).`
                    if(data.reqs[k].length !== 0){
                        acc += ` Requisitos:${data.reqs[k].reduce((acc1, i1) => {
                            acc1 += `\n   > ${i1.id} - ${i1.nome};`; return acc1;
                        }, ``).slice(0, -1) + ';'}`
                    } else {
                        acc += ' Sem requisitos;'
                    }
                    if(k !== data.info.length-1)
                        acc += '\n----------------------------------------'
                    return acc
                }, ``).slice(0, -1) + '.'
            },
            '~instmatseldel~'   : async (num) => {
                let {info} = await this.requests['getsubjectsoneff'](num)
                return info.reduce((acc, i, k) => {
                    acc += `\n> ${i.id} - ${i.nome} (${i.carga} horas);`
                    return acc
                }, ``).slice(0, -1) + '.'
            },
            'getsubjectsoneff'  : async (num) => {
                let [eff, user] = await Promise.all([db.request(`select data from effetivate where numero = '${num}';`).then((info) => {
                    return JSON.parse(info[0][0].data)
                }).catch((err) => {
                    console.log(err)
                    return 'Error, data not found.'
                }), this.getUser(num)])
                let info = (await db.request(`select * from disc_${this.cursos[user.curso]} where id in
                    (${eff.ids.reduce((acc, i) => { acc += `${i}, `; return acc }, '').slice(0, -2)});`))[0]
                return {info, user}
            },
            '~finalizar~'       : async (num) => {
                let user = await this.getUser(num)
                if((await db.request(`select * from user_${this.cursos[user.curso]} where matricula = '${user.matricula}';`))[0].length == 0){
                    return ''
                }
                return 'Como você já selecionou algumas matérias, você pode finalizar aqui se quiser. Basta me mandar um "finalizar".'
            },
        }
    }

    async getUser(num){
        let user = (await db.request(`select * from registro where finished = '0' and numero = '${num}';`))[0]
        if(user.length > 0)
            return user[0]
        return (await db.request(`select * from inst_cadastro where numero = '${num}';`))[0][0]
    }

    getTextInfo(tag, num){
        try{
            return this.requests[tag](num)
        } catch(err){
            console.log('Erro ao retornar a informação.\n', err)
            return('ERROR, data not found.')
        }
    }

    async setTags(msg, obj){
        let txt = msg.map((i) => i)
        let tags = {}
        for(let i in txt){
            try{
                let t = txt[i].match(/[~]\w+[~]/g)
                for(let j in t){
                    if(!(t[j] in tags))
                        tags[t[j]] = await this.getTextInfo(t[j], obj)
                    txt[i] = txt[i].replaceAll(t[j], tags[t[j]])
                }    
            } catch(err){}
        }      
        return txt
    }

    getSQL(tag, obj){
        let query = this.sql[tag]
        try{
            let data = query.match(/[-]\w+[-]/g)
            for(let i in data){
                query = query.replaceAll(data[i], obj[data[i].slice(1, -1)])
            }
        } catch(err){
            console.log('Erro no getSQL.\n', err)
        }
        return query
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
            let cursoIds = ids[this.cursos[obj.curso]]
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
            return db.request(`insert into inst_cadastro values (default, '${num}', '0');`)
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
            let user = await fd.getUser(num)
            let sql = `update registro set ${line} where matricula = "${user.matricula}";`
            if(!('matricula' in user))
                sql = `update inst_cadastro set ${line} where numero = "${num}";`
            if(eff)
                return await this.saveOnEffetivate(num, sql, obj)
            await db.request(sql.replaceAll(`"`, `'`))
        } catch(err){
            console.log(err)
        }
    }

    async saveOnEffetivate(num, sql, data){
        console.log(sql)
        console.log(data)
        return
        let query = sql.replaceAll(`'`, `"`)
        let prev = (await db.request(`select * from effetivate where numero = '${num}';`))[0]
        if(prev.length === 0)
            return db.request(`insert into effetivate values ('${num}', '${query}', '${JSON.stringify(data)}');`)
        return db.request(`update effetivate set query = '${query}', data = '${JSON.stringify(data)}' where numero = '${num}';`)
    }

    async getEffetivate(num){
        return JSON.parse((await db.request(`select data from effetivate where numero = '${num}';`))[0][0].data)
    }

    async effetivate(num){
        let sql = await db.request(`select query from effetivate where numero = '${num}';`).then((data) => {
            if(data[0][0])
                db.request(`delete from effetivate where numero = '${num}';`)
            return data[0][0]
        }).catch((err) => {
            throw new Error('Erro ao efetivar os dados.\n', err)
        })
        sql = sql.query.split(';').slice(0, -1)
        let querys = []
        for(let i in sql)
            querys.push(db.request(sql[i].replaceAll(`"`, `'`) + ';'))
        await Promise.all(querys)
    }

    getRequest(tag, num){
        return fd.getTextInfo(tag, num)
    }
}

const database = new DataBaseAccess()

export { db, fd, database }