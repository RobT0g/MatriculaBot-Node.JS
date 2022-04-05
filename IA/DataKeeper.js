import { mysql } from '../Dependencies/Index.js'

/** TODO
 * Implementar testes para o uso de promises, o código não precisa esperar que o dado seja armazenado.
 */

 class DataBaseCon{
    constructor(){
        this.loaded = false
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
        this.disciplinasId = {}
        let conn = await this.connect()
        for(let i in this.cursos){
            this.disciplinasId[this.cursos[i]] = (((await conn.query(`select id from disc_${this.cursos[i]} 
            group by periodo;`))[0]).map((j) => j.id))
        }
        this.loaded = true
    }

    async request(sql) {
        if(!this.loaded)
            await this.load()
        try {
            let conn = await this.connect()
            //console.log(sql)
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
        this.cursos = ['adm', 'ec', 'fis', 'tce']
        this.altTags = {'datanas':'nascimento', 'mat':'matricula', 'ano': 'turma', 
            'addmatnums': 'discId'}
        this.requests = {
            '~mat~'         : async (obj) => {
                return (await db.request(`select matricula from registro where numero = '${obj.num}';`))[0][obj.matAt].matricula
            },
            '~nome~'        : async (obj) => {
                return (await db.request(`select nome from registro where numero = '${obj.num}';`))[0][obj.matAt].nome
            },
            '~email~'       : async (obj) => {
                return (await db.request(`select email from registro where numero = '${obj.num}';`))[0][obj.matAt].email
            },
            '~curso~'       : async (obj) => {
                return (await db.request(`select curso from registro where numero = '${obj.num}';`))[0][obj.matAt].curso
            },
            '~ano~'         : async (obj) => {
                return (await db.request(`select ano from registro where numero = '${obj.num}';`))[0][obj.matAt].ano
            },
            '~cpf~'         : async (obj) => {
                return (await db.request(`select cpf from registro where numero = '${obj.num}';`))[0][obj.matAt].cpf
            },
            '~recdisc~'     : async (obj) => {
                let info = (await db.request(`select * from registro where numero = '${obj.num}';`))[0][obj.matAt]
                let data = (await db.request(`select u.discId, d.nome, d.carga, u.adicionar from 
                    user_${this.cursos[info.curso]} as u join disc_${this.cursos[info.curso]} as d 
                    on u.discId = d.id where u.matricula = '${info.matricula}' order by u.discId;`))[0]
                let retn = ''
                data.forEach((i, k) => {
                    retn += `\n${i.id} - ${i.nome} (${i.carga} horas)${k == data.length-1?'.':';'}`
                })
                return retn 
            },
            '~userinfo~'    : async (obj) => {
                let data = (await db.request(`select * from registro where numero = '${obj.num}';`))[0][obj.matAt]
                return `\n> Nome: ${data.nome};\n> Matricula: ${data.matricula};\n> Email: ${data.email};\n` + 
                    `> Curso: ${this.cursosName[data.curso]} turma de ${data.turma};\n` + 
                    `> CPF: ${data.cpf}.`
            },
            '~discesc~'     : async (obj) => { 
                let data = (await db.request(`select u.discId, d.nome, d.carga, u.adicionar from user_-curso- as u 
                join disc_-curso- as d on u.discId = d.id where u.matricula = '-matricula-' order by u.discId;`))[0]
                if(data.length == 0)
                    return 'Você ainda não selecionou nenhuma matéria para retirar ou adicionar.'
                try{
                    let res = ['', '']
                    for(let i in data){
                        res[(data[i].adicionar == '1')?0:1] += `\n> ${data[i].discId} - ${data[i].nome} (${data[i].carga} horas);`
                    }
                    let txt = ''
                    if(res[0].length > 0)
                        txt += ('Matérias para adicionar:' + res[0].slice(0, -1) + '.')
                    if(res[0].length > 0)
                        txt += ('\nMatérias para retirar:' + res[1] + '.')
                    return txt
                } catch(err){
                    console.log('Erro em ~discesc~.\n', err)
                    return 'Você ainda não selecionou nenhuma matéria.'
                }
            },
            '~getmatriz~'   : async (obj) => {
                return (await db.request(`select text from messages where tag = '~getmatriz~';`))[0][0].text
            },
            '~getformremat~': async (obj) => {
                return (await db.request(`select text from messages where tag = '~getformremat~';`))[0][0].text
            },
        }
    }

    getTextInfo(tag, obj){
        try{
            return this.requests[tag](obj)
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

    async getUserInfo(num){
        let user = (await db.request(`select * from registro where finished = '0' and numero = '${num}';`))[0]
        if(user.length === 0){
            return (await db.request(`select * from inst_cadastro where numero = '${num}';`))[0][0]
        }
        /*
        let actualUser = []
        if(user.length > 1){
            console.log('MULTIPLOS USUÁRIOS NO MESMO NÚMERO E SEM FINALIZAR!')
            //Coment this if it is problematic
            user.forEach(async (i, k) => {
                if(!(Object.keys(i).map((j) => i[j]).includes(null))){
                    console.log('USUÁRIO EM REGISTRO FINALIZADO NAO COLOCOU O CADASTRO COMO FINALIZADO')
                    await db.request(`update registro set finished = '1' where matricula = '${i.matricula}';`)
                } else
                    actualUser.push(k)
            })
            //Untill here
        } else
            actualUser = [0]
        if(actualUser.length > 1){
            console.log('NOW THIS IS A REAL PROBLEM')
        }*/
        return user[0]
    }

    async getUserRegister(num){
        try{
            let user = (await db.request(`select talkat from registro where numero = '${num}' and finished = '0';`))[0]
            if(user.length > 0)
                return user
            return (await db.request(`select talkat from inst_cadastro where numero = '${num}';`))[0]
        } catch(err){
            console.log('Erro em getUserRegister.\n', err)
            return null
        }
    }

    addUser(num){
        try{
            return db.request(`insert into inst_cadastro values (default, '${num}', '0');`)
        } catch(err){
            console.log(err)
        }
    }



    async updateUser(num, obj){
        console.log(obj)
        let line = Object.keys(obj).reduce((acc, i) => {
            acc += `${i in fd.altTags?fd.altTags[i]:i} = '${obj[i]}', `
            return acc
        }, '').slice(0, -2)
        try{
            if((await db.request(`select talkat from registro where numero = '${num}';`))[0].length > 0)
                return db.request(`update registro set ${line} where numero = '${num}';`)
            return db.request(`update inst_cadastro set ${line} where numero = '${num}';`)
        } catch(err){
            console.log(err)
        }
    }

    async saveOnEffetivate(num, sql, data){
        let prev = (await db.request(`select * from effetivate where numero = '${num}';`))[0]
        if(prev.length === 0)
            return db.request(`insert into effetivate values ('${num}', '${sql}', '${data}');`)
        return db.request(`update effetivate set query = '${sql}', data = '${data}' where numero = '${num}';`)
    }

    async effetivate(num){
        let sql = (await db.request(`select query from effetivate where numero = '${num}';`))[0][0].query.split(';').slice(0, -1)
        await db.request(`delete from effetivate where numero = '${num}';`)
        for(let i in sql)
            await db.request(sql[i].replaceAll(`"`, `'`) + ';')
    }
    /*
    async getUserInfo(num){
        let conn = await this.connect()
        try{
            let data = (await conn.query(`select * from cadastro where numero = '${num}';`))[0][0]
            data.curso = data.curso?Number(data.curso)-1:null
            return data
        }catch(err){
            console.log('Erro em getCurso.\n', err)
            return null
        }
    }
    
    async setDataOntoText(msg, obj) {
        let msgs = msg.map((i) => i)
        let info = await this.getUserInfo(obj.num)
        for(let i in info)
            if(info[i])
                obj[i] = info[i]
        if(obj.curso){
            obj = fd.setInfoOnObj(obj, this.disciplinasId)
            obj.curso = fd.cursos[obj.curso-1]
            console.log(obj.curso)
        }
        try{
            for(let i in msgs){
                let tags = msgs[i].match(/[~]\w+[~]/g)
                for(let j in tags){
                    let sql = fd.getSQL(tags[j], obj)
                    let conn = await this.connect()
                    let data = (await conn.query(sql))[0]
                    msgs[i] = fd.formateData(msgs[i], data, tags[j])
                }
            }
        } catch(err){
            console.log('Erro no setDataOntoText (database).\n', err)
        }
        return msgs
    }

    async registerDiscs(num, items, add){
        let info = await this.getUserInfo(num)
        let conn = await this.connect()
        try{
            let discs = await conn.query(`select discId, adicionar from user_${fd.cursos[(info.curso)]} 
                where matricula = '${info.matricula}';`)
            let modifier = {add: [], del: []}
            let ondb = []
            //console.log(discs[0])
            discs[0].forEach((i) => {
                if(items.includes(String(i.discId))){
                    if((i.adicionar == '1') !== add)
                        modifier.del.push(String(i.discId))
                    else
                        ondb.push(String(i.discId))
                }
            })
            items.forEach((i) => {
                if(!(ondb.includes(i))){
                    modifier.add.push(i)
                }
            })
            let sql = ''
            if(modifier.del.length > 0){
                sql += ` delete from user_${fd.cursos[(info.curso)]} where ${modifier.del.reduce((acc, i) => {
                    acc += `discId = "${i}" or `;
                    return acc
                }, '').slice(0, -4)};`
            }
            sql += `insert into user_${fd.cursos[(info.curso)]} values ${modifier.add.reduce((acc, i) => {
                acc += (`(default, "${info.matricula}", "${i}", "${add?'1':'0'}"), `);
                return acc;
            }, '').slice(0, -2)};`
            let exists = (await conn.query(`select * from inst_save where matricula = '${info.matricula}';`))[0].length == 0
            if(exists)
                await conn.query(`insert into inst_save value (default, '${info.matricula}', '${sql}')`)
            else
                await conn.query(`update inst_save set query = '${sql}' where matricula = '${info.matricula}';`)
        } catch(err){
            console.log('Erro em registerDiscs.\n', err)
        }
    }

    async effetivate(num){
        try{
            let info = await this.getUserInfo(num)
            let conn = await this.connect()
            let sql = (await conn.query(`select query from inst_save where matricula = '${info.matricula}';`)
                )[0][0].query.split(';')
            sql.pop()
            for(let i in sql){
                await conn.query(sql[i].replaceAll(`"`, `'`) + ';')
            }
            await conn.query(`delete from inst_save where matricula = '${info.matricula}';`)  
        } catch(err){
            console.log('Erro no effetivate.\n', err)
        }
        
    }

    async uploadIntoInstSave(num, sql){
        let info = await this.getUserInfo(num)
        let conn = await this.connect()
        await conn.query(`insert into inst_save values (default, '${info.matricula}', '${sql}');`)
    }
    */
}

const database = new DataBaseAccess()

export { db, fd, database }