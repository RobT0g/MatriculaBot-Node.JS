import { mysql } from '../Dependencies/Index.js'

/** TODO
 * 
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

