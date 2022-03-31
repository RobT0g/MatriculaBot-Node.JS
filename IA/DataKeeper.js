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
            return (await conn.query(sql))[0]
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
        this.registerSQL = 'update -database- set -info- where -identifier-;'
        this.simpleSQL = "select what from cadastro where numero = '-num-';"
        this.simpleExtraInfo = "select text from messages where tag = 'request';"
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
            '~recdisc~'     : `select id, nome, carga from disc_-curso- where id not in (select discId from req_-curso- where reqId >= '-maxreq-') and ativa = '1';`,
            '~userinfo~'    : `select * from cadastro where numero = '-num-';`,
            '~discesc~'     : `select u.discId, d.nome, d.carga, u.adicionar from user_-curso- as u 
                join disc_-curso- as d on u.discId = d.id where u.matricula = '-matricula-' order by u.discId;`,
            '~getmatriz~'   : this.simpleExtraInfo.replaceAll('request', '~getmatriz~'),
            '~getformremat~': this.simpleExtraInfo.replaceAll('request', '~getformremat~')
        }
        this.sql = {
            '~mat~'         : this.simpleSQL.replaceAll('what', 'matricula'),
            '~nome~'        : this.simpleSQL.replaceAll('what', 'nome'),
            '~email~'       : this.simpleSQL.replaceAll('what', 'email'),
            '~curso~'       : this.simpleSQL.replaceAll('what', 'curso'),
            '~ano~'         : this.simpleSQL.replaceAll('what', 'turma'),
            '~cpf~'         : this.simpleSQL.replaceAll('what', 'cpf'),
            '~recdisc~'     : `select id, nome, carga from disc_-curso- where id not in (select discId from req_-curso- where reqId >= '-maxreq-') and ativa = '1';`,
            '~userinfo~'    : `select * from cadastro where numero = '-num-';`,
            '~discesc~'     : `select u.discId, d.nome, d.carga, u.adicionar from user_-curso- as u 
                join disc_-curso- as d on u.discId = d.id where u.matricula = '-matricula-' order by u.discId;`,
            '~getmatriz~'   : this.simpleExtraInfo.replaceAll('request', '~getmatriz~'),
            '~getformremat~': this.simpleExtraInfo.replaceAll('request', '~getformremat~')
        }
        this.formate = {
            '~mat~'         : (data) => {return data[0].matricula},
            '~nome~'        : (data) => {return data[0].nome},
            '~email~'       : (data) => {return data[0].email},
            '~curso~'       : (data) => {return this.cursosName[(Number(data[0].curso))-1]},
            '~ano~'         : (data) => {return data[0].turma},
            '~cpf~'         : (data) => {return data[0].cpf},
            '~recdisc~'     : (data) => {
                let retn = ''
                for(let i in data)
                    retn += `\n${data[i].id} - ${data[i].nome} (${data[i].carga} horas)${i == data.length-1?'.':';'}`
                return retn
            },
            '~userinfo~'    : (data) => {
                return `\n> Nome: ${data[0].nome};\n> Matricula: ${data[0].matricula};\n> Email: ${data[0].email};\n` + 
                    `> Curso: ${this.cursosName[Number(data[0].curso)-1]} turma de ${data[0].turma};\n` + 
                    `> CPF: ${data[0].cpf}.`
            },
            '~discesc~'     : (data) => {
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
            '~getmatriz~'   : (data) => {return data[0].text},
            '~getformremat~': (data) => {return data[0].text}
        }
    }

    getTextInfo(tag, obj){
        return this.requests[tag](obj)
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

    getUserRegister(num){
        try{
            return db.request(`select talkat from cadastro where numero = '${num}';`)
        } catch(err){
            console.log('Erro em getUserRegister.\n', err)
            return null
        }
    }

    async addUser(numero){
        try{
            await db.upload(`insert into cadastro (numero) value ('${numero}');`)
            console.log(`Usuário cadastrado!`)
        } catch(err){
            console.log(err)
        }
    }

    async updateUser(num, obj){
        let conn = await this.connect()
        console.log(obj)
        let line = Object.keys(obj).reduce((acc, i) => {acc += 
            `${i in fd.registerFields?(fd.registerFields[i]):i.slice(1, -1)} = '${obj[i]}', `; 
            return acc}, '').slice(0, -2)
        try{
            await conn.query(`update cadastro set ${line} where numero = '${num}';`)
            console.log(`Usuário atualizado!`)
        } catch(err){
            console.log(err)
        }
    }

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
}

const database = new DataBaseAccess()

export { database, db }