import { db } from "./IA/DataKeeper.js";

(async() => {
    let names = ['adm', 'ec', 'fis', 'tce']
    let cursos = await Promise.all(names.map(async i => (await db.request(`select * from disc_${i};`))[0]))
    //console.log(cursos)
    let query = []
    for(let i in cursos){
        query.push(`update disc_${names[i]} set ativa = '1', parap = periodo;`)
    }
    query.forEach(i => {
        db.request(i)
    })
})()