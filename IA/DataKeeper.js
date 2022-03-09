import { mysql } from '../Dependencies/Index.js'

class DatabaseCore{
    constructor(dbName){
        this.dbName = dbName
    }

    connect = async function(){
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
            database    : this.dbName
        });	
        this.con = con	
        console.log('Conectado.')
        return this.con
    }
}

class FormatedData{
    constructor(){
        this.cursosName = ['Administração', 'Engenharia da Computação', 'Física', 'Construção de Edifícios']
        this.cursos = ['adm', 'ec', 'fis', 'tce']
        this.simpleSQL = "select what from cadastro where numero = '-num-';"
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
                join disc_-curso- as d on u.discId = d.id where u.matricula = '-matricula-' order by u.discId;`
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
            }
        }
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
        this.cursosName = ['Administração', 'Engenharia da Computação', 'Física', 'Construção de Edifícios']
        this.cursos = ['adm', 'ec', 'fis', 'tce']
    }

    load = async function() {
        this.database = new DatabaseCore('botdata')
        this.disciplinasId = {}
        let conn = await this.database.connect()
        for(let i in this.cursos){
            this.disciplinasId[this.cursos[i]] = (((await conn.query(`select id from disc_${this.cursos[i]} 
            group by periodo;`))[0]).map((j) => j.id))
        }
        this.loaded = true
    }

    getUserRegister = async function(num){
        let conn = await this.database.connect()
        try{
            return (await conn.query(`select talkat from cadastro where numero = '${num}';`))[0][0]
        } catch(err){
            console.log('Erro em getUserRegister.\n', err)
            return null
        }
    }

    addUser = async function(numero){
        let conn = await this.database.connect()
        try{
            await conn.query(`insert into cadastro (numero) value ('${numero}');`)
            console.log(`Usuário cadastrado!`)
        } catch(err){
            console.log(err)
        }
    }

    updateUser = async function(num, obj){
        console.log(obj)
        let conn = await this.database.connect()
        console.log(obj)
        let line = Object.keys(obj).reduce((acc, i) => {acc += `${i} = '${obj[i]}', `; 
            return acc}, '').slice(0, -2)
        try{
            await conn.query(`update cadastro set ${line} where numero = '${num}';`)
            console.log(`Usuário atualizado!`)
        } catch(err){
            console.log(err)
        }
    }

    getUserInfo = async function(num){
        let conn = await this.database.connect()
        try{
            let data = (await conn.query(`select * from cadastro where numero = '${num}';`))[0][0]
            data.curso = data.curso?Number(data.curso)-1:null
            return data
        }catch(err){
            console.log('Erro em getCurso.\n', err)
            return null
        }
    }

    setDataOntoText = async function(msg, obj) {
        let msgs = msg.map((i) => i)
        let info = await this.getUserInfo(obj.num)
        for(let i in info)
            if(info[i])
                obj[i] = info[i]
        if(obj.curso){
            obj = fd.setInfoOnObj(obj, this.disciplinasId)
            obj.curso = this.cursos[obj.curso]
        }
        try{
            for(let i in msgs){
                let tags = msgs[i].match(/[~]\w+[~]/g)
                for(let j in tags){
                    let sql = fd.getSQL(tags[j], obj)
                    let conn = await this.database.connect()
                    let data = (await conn.query(sql))[0]
                    msgs[i] = fd.formateData(msgs[i], data, tags[j])
                }
            }
        } catch(err){
            console.log('Erro no setDataOntoText (database).\n', err)
        }
        return msgs
    }
}

const database = new DataBaseAccess()

export { database }