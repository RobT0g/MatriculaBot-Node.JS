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
        this.cursos = [], this.cursosName = []
        this.disciplinasId = {}, this.amount = {}
        let conn = await this.connect()
        let info = (await conn.query(`select * from cursos;`))[0]
        info.forEach((v) => {
            this.cursos.push(v.abrev)
            this.cursosName.push(v.cursonome)
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
        if(!(num in this.users)){
            let user = (await this.request(`select matricula, nome, email, curso, turma, cpf from registro where numero = ${num};`))[0][0]
            if(!user){
                return null
            }
            this.users[num] = user
        }
        return this.users[num]
    }

    async refreshUser(num){
        user = (await this.request(`select matricula, nome, email, curso, turma, cpf from registro where numero = ${num};`))[0][0]
        if(user){
            this.users[num] = user
        }
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
            '~defdisc~'         : async (num) => {
                let {curso, turma} = await db.getUser(num)
                let maxp = (await db.request(`select max(periodo) from disc_${db.cursos[curso]};`))[0][0]['max(periodo)']
                let date = new Date()
                let periodo = (date.getFullYear()-turma)*2 + ((date.getMonth() > 6)?2:1)
                if(periodo > maxp)
                    periodo = maxp
                let mats = await db.request(`select id, nome, carga from disc_${db.cursos[curso]} where parap = ${periodo};`)
                return mats[0].reduce((acc, i) => {
                    acc += `${i.id}. ${i.nome} (${i.carga} horas);\n`
                    return acc
                }, '').slice(0, -2) + '.'
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
                let data = (await db.request(`select * from registro where numero = '${num}' and finished = '0';;`))[0][0]
                return `\n> Matricula: ${data.matricula};\n> Nome: ${data.nome};\n> Email: ${data.email};\n` + 
                    `> Curso: ${db.cursosName[data.curso]}, da turma de ${data.turma};\n` + 
                    `> CPF: ${data.cpf}.`
            },
            'getdiscs'          : async (num) => {
                let info = await db.getUser(num)
                return (await db.request(`select u.discId, d.nome, d.carga from user_${db.cursos[info.curso]} as u 
                    join disc_${db.cursos[info.curso]} as d on u.discId = d.id where u.matricula = '${info.matricula}' order by u.discId;`))[0]
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
                let user = await db.getUser(num)
                let reqs = (await Promise.all(Object.keys(info.outuser).reduce((acc, i) => {
                    acc.push(db.request(`select r.reqId, d.nome from req_${db.cursos[user.curso]} as r join disc_${db.cursos[user.curso]} as
                        d on r.reqId = d.id where r.discId = '${i}';`))
                    return acc
                }, [])))
                reqs = Object.keys(info.outuser).reduce((acc, i, k) => {
                    acc[i] = reqs[k][0]
                    return acc
                }, {})
                let txt = info.outuser.reduce((acc, i) => {
                    acc += ``
                })
            },
            '~instmatseldel~'   : async (num) => {
                let discs = await this.requests.getsubjectsoneff(num)
                console.log(discs)
            },
            'getsubjectsoneff'  : async (num) => {
                let user = await db.getUser(num)
                let [[discs]] = await db.request(`select data from effetivate where numero = '${num}';`)
                discs = JSON.parse(discs.data).ids.map(i => Number(i))
                let [[userdiscs], [valdiscs]] = await Promise.all([db.request(`select discId from user_${db.cursos[user.curso]} where 
                    matricula = '${user.matricula}';`), db.request(`select id, nome, carga, ativa from disc_${db.cursos[user.curso]} where id in 
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
                if((await db.request(`select * from user_${db.cursos[user.curso]} where matricula = '${user.matricula}';`))[0].length == 0){
                    return ''
                }
                return 'Como você já selecionou algumas matérias, você pode finalizar aqui se quiser. Basta me mandar um "finalizar".'
            },
        }
    }

    async getUser(num){
        let user = (await db.request(`select * from registro where numero = '${num}';`))[0]
        if(user.length > 0)
            return user[0]
        return (await db.request(`select * from inst_cadastro where numero = '${num}';`))[0][0]
    }

    async getTextInfo(tag, num){
        try{
            return await this.requests[tag](num)
        } catch(err){
            console.log('Erro ao retornar a informação.\n', err)
            return tag.slice(1, -1)
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
            let user = await db.getUser(num)
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
        let sql = await db.request(`select query from effetivate where numero = '${num}';`)
        if(sql[0][0]){
            await db.request(`delete from effetivate where numero = '${num}';`)
            sql = sql[0][0].query.split(';').slice(0, -1)
            let querys = []
            for(let i in sql)
                querys.push(db.request(sql[i].replaceAll(`"`, `'`) + ';'))
            await Promise.all(querys)
            await Promise.all([db.request(`delete from effetivate where numero = '${num}';`), db.refreshUser(num)])
        }
    }

    getRequest(tag, num){
        return fd.getTextInfo(tag, num)
    }
}

const database = new DataBaseAccess()

export { db, fd, database }